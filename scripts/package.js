/* eslint strict: 0, no-shadow: 0, no-unused-vars: 0, no-console: 0 */
// based upon https://raw.githubusercontent.com/chentsulin/electron-react-boilerplate/master/package.js
'use strict'

const os = require('os')
const webpack = require('webpack')
const cfg = require('../webpack.production.config.js')
const packager = require('electron-packager')
const del = require('del')
const exec = require('child_process').exec
const argv = require('minimist')(process.argv.slice(2))
const pkg = require('../package.json')
const devDeps = Object.keys(pkg.devDependencies)
const q = require('q')
const fs = require('fs')

const appName = argv.name || argv.n || pkg.productName
const shouldUseAsar = argv.asar || argv.a || false
const shouldBuildAll = argv.all || false

const DEFAULT_OPTS = {
  dir: './',
  name: appName,
  asar: shouldUseAsar,
  ignore: [
    '/test($|/)',
    '/tools($|/)',
    '/scripts($|/)',
    '/release($|/)',
    '/src($|/)',
    '/webpack\..*',
    '/README.md',
    '/.gitignore',
    '/.DS_Store',
  ].concat(devDeps.map(name => `/node_modules/${name}($|/)`))
}

const icon = argv.icon || argv.i || 'app/app.icns'

if (icon) {
  DEFAULT_OPTS.icon = icon
}

const version = argv.version || argv.v

if (version) {
  DEFAULT_OPTS.version = version
  startPack()
} else {
  // use the same version as the currently-installed electron-prebuilt
  exec('npm list electron-prebuilt', (err, stdout) => {
    if (err) {
      DEFAULT_OPTS.version = '0.36.2'
    } else {
      DEFAULT_OPTS.version = stdout.split('electron-prebuilt@')[1].replace(/\s/g, '')
    }

    startPack()
  })
}

function startPack () {
  console.log('start pack...')
  webpack(cfg, (err, stats) => {
    if (err) return console.error(err)

    q.all([
      del('release'),
      copyFile('./src/client/index.html', './dist/client.html')
    ])
      .then(() => {
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
      })
      .catch(err => {
        console.error(err)
      })
  })
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

function copyFile(src, dest) {
  const deferred = q.defer()

  const stream = fs.createReadStream(src).pipe(fs.createWriteStream(dest))
  stream.on('finish', deferred.resolve)
  stream.on('error', deferred.reject)

  return deferred.promise
}
