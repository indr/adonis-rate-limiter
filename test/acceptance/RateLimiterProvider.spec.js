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
    let sut

    beforeEach(function () {
      sut = fold.Ioc.use('RateLimiter')
    })

    it('should throw RateLimitExceededException when rate limit is exceeded', function * () {
      yield sut.perform('subject-1', 'key', 2, 5)
      yield sut.perform('subject-1', 'key', 2, 5)
      yield sut.perform('subject-2', 'key', 2, 5)

      try {
        yield sut.perform('subject-1', 'key', 2, 5)
      } catch (error) {
        assert.equal(error.name, 'RateLimitExceededException')
        assert.equal(error.message, 'key-rate-limit-exceeded')
        assert.equal(error.status, 429)
        assert.isAbove(error.secondsToWait, 4)
      }
    })

    it('should not throw RateLimitExceededException given subject is 127.0.0.1', function * () {
      const subject = '127.0.0.1'

      yield sut.perform(subject, 'key', 1, 5)
      yield sut.perform(subject, 'key', 1, 5)
    })
  })
})
