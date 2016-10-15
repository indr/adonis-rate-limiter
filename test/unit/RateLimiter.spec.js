/**
 * adonis-rate-limiter
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

'use strict'

/* eslint-env mocha */

const assert = require('chai').assert
require('co-mocha')

const RateLimit = require('../../src/RateLimit')
const RateLimiter = require('../../src/RateLimiter')

const RedisStub = {
  * expire () {
  },

  * llen () {
    return 0
  },

  * lpush () {
  },

  * lrange () {
    return []
  },

  * ltrim () {
  }
}

describe('Unit | RateLimiter', function () {
  let sut

  beforeEach(function () {
    sut = new RateLimiter(RedisStub)
  })

  describe('make', function () {
    it('returns RateLimit instance', function () {
      const actual = sut.make('subject', 'key', 1, 1)

      assert.instanceOf(actual, RateLimit)
    })
  })

  describe('perform', function () {
    it('performs and returns RateLimit instance', function * () {
      const actual = yield sut.perform('subject', 'key', 1, 1)

      assert.instanceOf(actual, RateLimit)
    })
  })
})
