# adonis-rate-limiter

[![npm version](https://badge.fury.io/js/adonis-rate-limiter.svg)](https://badge.fury.io/js/adonis-rate-limiter)
[![Build Status](https://travis-ci.org/indr/adonis-rate-limiter.svg?branch=master)](https://travis-ci.org/indr/adonis-rate-limiter)
[![dependencies Status](https://david-dm.org/indr/adonis-rate-limiter/status.svg)](https://david-dm.org/indr/adonis-rate-limiter)
[![devDependencies Status](https://david-dm.org/indr/adonis-rate-limiter/dev-status.svg)](https://david-dm.org/indr/adonis-rate-limiter?type=dev)

Rate limiter for AdonisJs framework using Redis.

## Installation

```
npm install adonis-rate-limiter --save
```

After installation, you need to register the provider and an optional alias inside `bootstrap/app.js` file.

```javascript
// bootstrap/app.js

const providers = [
  ...,
  'adonis-rate-limiter/providers/RateLimiterProvider'
]

const aliases = [
  ...,
  RateLimiter: 'Adonis/Addons/RateLimiter',
]
```

## Usage

### Rate limit a specific action

Use the `RateLimiter` provider to limit an action for a given subject (eg. IP address, user id) and period.

The following example mitigates brute force attacks by limiting the number of login attempts for an IP address to 6 attempts per minute and 30 attempts per hour.

```javascript
// app/Http/Controllers/AuthController.js

const RateLimiter = use('RateLimiter')

class AuthController {

  * login (request, response) {
    const ipAddress = request.request.socket.remoteAddress
    yield RateLimiter.perform(ipAddress, 'login-min', 6, 60)
    yield RateLimiter.perform(ipAddress, 'login-hr', 30, 3600)
    
    ...
  }
}
```

If the subject exceeds the maximum number a `RateLimitExceededException` is thrown. The exception contains these properties:

 * `message`: The action key in the format `{key}-rate-limit-exceeded`, eg. `login-min-rate-limit-exceeded`
 * `secondsToWait`: The number of seconds the subject has to wait until it can perform the action again
 * `status`: 429 (HTTP status code for too many requests)
 
You can conveniently handle this exception in your HTTP exception handler like this:

```javascript
  RateLimitExceededException: function (error, request, response) {
    const status = error.status || 429
    const message = error.message || 'Rate limit exceeded'
    return { status, message }
  }
```

Have a look at [app/Services/ExceptionParser.js](https://github.com/adonisjs/adonis-rally/blob/develop/app/Services/ExceptionParser.js) of the Adonis Rally project.

### Auto IP ban

The following middleware automatically blocks an IP address after a number of requests that resulted in a response status code equal to or above 400.

```javascript
// app/Http/Middleware/AutoIpBan.js

const RateLimiter = use('RateLimiter')

class AutoIpBan {
  * handle (request, response, next) {
    const ipAddress = request.request.socket.remoteAddress
    const minuteLimiter = RateLimiter.make(ipAddress, 'auto-ip-ban-ms', 10, 60)
    const hourLimiter = RateLimiter.make(ipAddress, 'auto-ip-ban-hr', 60, 3600)

    if ((yield minuteLimiter.isUnderLimit()) && (yield hourLimiter.isUnderLimit())) {
      yield next
    } else {
      response.tooManyRequests({ status: 429, message: 'Too many suspicious requests' })
      return
    }

    if (response.response.statusCode >= 400) {
      yield minuteLimiter.add()
      yield hourLimiter.add()
    }
  }
}

module.exports = AutoIpBan
```

You might want to add this middleware to your list of the global middlware just before `Cors`:

```javascript
// app/Http/kernel.js

const globalMiddleware = [
  'App/Http/Middleware/AutoIpBan',
  'Adonis/Middleware/Cors',
  ...
]
```

## Copyright and License

Copyright (c) 2016 Reto Inderbitzin, [MIT](LICENSE.md) License
