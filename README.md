# Orchestra
[![Build Status](https://travis-ci.org/swissmanu/orchestra.svg)](https://travis-ci.org/swissmanu/orchestra) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Crossplatform desktop application to control Logitech Harmony Hubs.


## Contribution
The `master` branch contains the latest stable release of the application.
Development efforts are integrated with the `develop` branch first. Changes get then merged into `master` as soon as a new release should be published.

When opening a new Pull Request make sure you point them to `develop`. Further ensure that your code follows [standard-js](http://standardjs.com/) style guidelines and you make use of proper commit messages. Orchestra loves [Commitizen](http://commitizen.github.io/cz-cli/), so take a look there and use `git cz` for the most simple workflow :-)

Thank you for your contribution!

## Development
Following `npm` commands are available:

```bash
$ npm run dev    # execute in development mode with hot react-hot-loader
$ npm run clean  # clean dist/ and release/ directories
$ npm run test   # execute tests and style checks
$ npm run dist   # run webpack in production mode, generates files in dist/
$ npm run pack   # package app only, without generating deployables
$ npm run build  # package app and build deployables in release/ directory
```

## Tech Stack
* [orchestra-jsapi](https://github.com/swissmanu/orchestra-jsapi)
  * [harmonyhubjs-client](https://github.com/swissmanu/harmonyhubjs-client)
  * [harmonyhubjs-discover](https://github.com/swissmanu/harmonyhubjs-discover)
* [React](https://github.com/facebook/react)
* [Electron](http://electron.atom.io/)
