/**
 * adonis-rate-limiter
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

'use strict'

const RateLimit = require('./RateLimit')

class RateLimiter {

  constructor (redis) {
    this._redis = redis
  }

  /**
   * Get a rate limiter instance
   */
  rateLimit (subject, key, max, secs) {
    return new RateLimit(this._redis, subject, key, max, secs)
  }

  /**
   * Perform action for given subject
   */
  * perform (subject, key, max, secs) {
    const rateLimit = this.rateLimit(subject, key, max, secs)
    yield rateLimit.perform()
    return rateLimit
  }
}

module.exports = RateLimiter
