/* eslint strict: 0, no-shadow: 0, no-unused-vars: 0, no-console: 0 */
// based upon https://raw.githubusercontent.com/chentsulin/electron-react-boilerplate/master/package.js
'use strict'

const os = require('os')
const packager = require('electron-packager')
const execSync = require('child_process').execSync
const exec = require('child_process').exec
const argv = require('minimist')(process.argv.slice(2))
const pkgElectron = require('../node_modules/electron-prebuilt/package.json')
const pkgInfo = require('../package.json')
const devDeps = Object.keys(pkgInfo.devDependencies)
const fs = require('fs')

const shouldBuildAll = argv.all || false

const appVersion = argv.version || argv.v || pkgInfo.version
const shaHash = execSync('git rev-parse HEAD').toString().substr(0, 7)

const commonOptions = {
  dir: './',
  name: pkgInfo.productName,
  version: pkgElectron.version,
  'app-version': appVersion,
  asar: true,
  prune: true,
  ignore: [
    '/test($|/)',
    '/tools($|/)',
    '/scripts($|/)',
    '/release($|/)',
    '/src($|/)',
    '/webpack\..*',
    '/README.md',
    '/.gitignore',
    '/.DS_Store'
  ].concat(devDeps.map(name => `/node_modules/${name}($|/)`))
}

const platformsToBuild = []
const platforms = {
  darwin: {
    platform: 'darwin',
    arch: 'x64',
    icon: 'assets/darwin/app-icon.icns',
    'build-version': shaHash
  }
  // win: { },
  // linux: { }
}

if (argv.all) {
  // Build for all platforms:
  Object.keys(platforms)
    .forEach((platformName) => platformsToBuild.push(platforms[platformName]))
} else if (argv.platform) {
  // Build for a specific platform
  if (platforms[argv.platform] == null) {
    console.error(`Could not find platform options for ${argv.platform}`)
    process.exit(1)
  }
  platformsToBuild.push(platforms[argv.platform])
}

if (platformsToBuild.length === 0) {
  console.error('Use --platform to build for a specific platform or --all')
  process.exit(1)
}

platformsToBuild.forEach((platformOptions) => {
  const id = `${platformOptions.platform}-${platformOptions.arch}`
  const platformSpecificOptions = Object.assign({}, commonOptions, platformOptions, {
    out: `release/${id}`
  })

  console.log(`Pack ${id}...`)
  packager(platformSpecificOptions, (err, filepath) => {
    if (err) {
      console.error(`Could not pack ${id}`)
      console.error(err)
      return
    }
    console.log(`${id} packed successfully to ${filepath}`)
  })
})
