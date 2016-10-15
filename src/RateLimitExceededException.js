/**
 * adonis-rate-limiter
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

'use strict'

const NE = require('node-exceptions')

class RateLimitExceededException extends NE.LogicalException {

  constructor (rateLimitType, secondsToWait) {
    super(rateLimitType, 429)
    this.secondsToWait = secondsToWait
  }
}

module.exports = RateLimitExceededException
