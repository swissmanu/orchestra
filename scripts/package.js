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

const DEFAULT_OPTS = {
  dir: './',
  name: pkgInfo.productName,
  version: pkgElectron.version,
  'app-version': appVersion,
  'build-version': shaHash,
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

const icon = argv.icon || argv.i || 'app/app.icns'

if (icon) {
  DEFAULT_OPTS.icon = icon
}

startPack()

function startPack () {
  console.log('start pack...')

  if (shouldBuildAll) {
    // build for all platforms
    const archs = ['ia32', 'x64']
    const platforms = ['linux', 'win32', 'darwin']

    platforms.forEach(plat => {
      archs.forEach(arch => {
        pack(plat, arch, log(plat, arch))
      })
    })
  } else {
    // build for current platform only
    pack(os.platform(), os.arch(), log(os.platform(), os.arch()))
  }
}

function pack (plat, arch, cb) {
  // there is no darwin ia32 electron
  if (plat === 'darwin' && arch === 'ia32') return

  const opts = Object.assign({}, DEFAULT_OPTS, {
    platform: plat,
    arch,
    prune: true,
    out: `release/${plat}-${arch}`
  })

  packager(opts, cb)
}

function log (plat, arch) {
  return (err, filepath) => {
    if (err) return console.error(err)
    console.log(`${plat}-${arch} finished!`)
  }
}
