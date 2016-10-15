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

const RateLimitExceededException = require('../src/RateLimitExceededException')

describe('Unit | RateLimitExceededException', function () {
  it('should set status 429 Too many requests', function () {
    const sut = new RateLimitExceededException('rate-limit-type', 3600)

    assert.equal(sut.status, 429)
    assert.equal(sut.message, 'rate-limit-type')
    assert.equal(sut.secondsToWait, 3600)
  })
})

