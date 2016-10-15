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

const config = require('./config')
const fold = require('adonis-fold')
const path = require('path')

module.exports = function (done) {
  const providers = [
    'adonis-redis/providers/RedisFactoryProvider',
    'adonis-redis/providers/RedisProvider'
  ]
  providers.push(path.join(__dirname, '../../providers/RateLimiterProvider'))

  fold.Registrar
    .register(providers)
    .then(() => {
      fold.Ioc.aliases({ RateLimiter: 'Adonis/Addons/RateLimiter' })

      fold.Ioc.fake('Adonis/Src/Config', function () {
        return {
          get: function (key, defaultValue) {
            return config[ key ] || defaultValue
          }
        }
      })

      fold.Ioc.fake('Adonis/Src/Helpers', () => {})

      done()
    })
}
