/**
 * adonis-rate-limiter
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

'use strict'

const ServiceProvider = require('adonis-fold').ServiceProvider
const RateLimiter = require('../src/RateLimiter')

class RateLimiterProvider extends ServiceProvider {

  * register () {
    this.app.singleton('Adonis/Addons/RateLimiter', function (app) {
      const redis = app.use('Adonis/Addons/Redis')
      return new RateLimiter(redis)
    })
  }
}

module.exports = RateLimiterProvider
