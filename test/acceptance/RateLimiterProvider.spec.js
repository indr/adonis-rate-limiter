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
const fold = require('adonis-fold')
require('co-mocha')

describe('Acceptance | RateLimiterProvider', function () {
  before(require('./before'))

  describe('Ioc registration', function () {
    it('should be able to resolve/use RateLimiter', function () {
      assert(fold.Ioc.use('RateLimiter'))
    })
  })

  describe('#perform', function () {
    it('should throw when rate limit is exceeded', function * () {
      const rateLimiter = fold.Ioc.use('RateLimiter')
      yield rateLimiter.perform('subject-1', 'key', 2, 5)
      yield rateLimiter.perform('subject-1', 'key', 2, 5)
      yield rateLimiter.perform('subject-2', 'key', 2, 5)
      try {
        yield rateLimiter.perform('subject-1', 'key', 2, 5)
      } catch (error) {
        assert.equal(error.name, 'RateLimitExceededException')
        assert.equal(error.message, 'key-rate-limit-exceeded')
        assert.equal(error.status, 429)
        assert.isAbove(error.secondsToWait, 4)
      }
    })
  })
})
