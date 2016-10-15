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

const config = module.exports = {}

config[ 'redis.connection' ] = 'local'
config[ 'redis.local' ] = {}

