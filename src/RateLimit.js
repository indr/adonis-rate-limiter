/**
 * adonis-rate-limiter
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

'use strict'

const RateLimitExceededException = require('./RateLimitExceededException')

class RateLimit {
  constructor (redis, subject, type, max, secs) {
    this._redis = redis
    this._subject = subject
    this._key = RateLimit._buildKey(subject, type)
    this._type = type
    this._max = max
    this._secs = secs
  }

  static _buildKey (subject, type) {
    const KeyPrefix = 'rate-limit'
    return `${KeyPrefix}:${subject}:${type}`
  }

  get key () {
    return this._key
  }

  * perform () {
    if (this.isUnlimited()) {
      return
    }

    if (yield this.isUnderLimit()) {
      yield this.push()
    } else {
      throw new RateLimitExceededException(this._type + '-rate-limit-exceeded', yield this.getSecondsToWait())
    }
  }

  * add () {
    if (this.isUnlimited()) {
      return
    }

    yield this.push()
  }

  * push () {
    // Simple ring buffer
    yield this._redis.lpush(this._key, Math.floor(new Date().getTime() / 1000))
    yield this._redis.ltrim(this._key, 0, this._max - 1)

    // Let's ensure we expire this key at some point
    yield this._redis.expire(this._key, this._secs * 2)
  }

  * getRemaining () {
    let arr = yield this._redis.lrange(this._key, 0, this._max) || []
    const t0 = Math.floor(new Date().getTime() / 1000)
    arr = arr.filter((a) => { return t0 - parseInt(a) <= this._secs })
    return this._max - arr.length
  }

  * getAgeOfOldest () {
    // age of oldest event in buffer, in seconds
    const a = yield this._redis.lrange(this._key, -1, -1)
    return Math.floor(new Date().getTime() / 1000) - a[ 0 ]
  }

  * getSecondsToWait () {
    return this._secs - (yield this.getAgeOfOldest())
  }

  * isUnderLimit () {
    // Number of events in buffer less than max allowed
    const numberOfEvents = yield this._redis.llen(this._key)
    if (numberOfEvents < this._max) {
      return true
    }

    // Age bigger than sliding window size?
    const ageOfOldest = yield this.getAgeOfOldest()
    return ageOfOldest > this._secs
  }

  isUnlimited () {
    return this._subject === '127.0.0.1'
  }
}

module.exports = RateLimit
