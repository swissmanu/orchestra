'use strict'

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const IPCAdapter = require('./ipcAdapter')
const join = require('path').join

// Report crashes to our server.
require('crash-reporter').start()

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')()
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8080/index.html')
    mainWindow.openDevTools()
  } else {
    mainWindow.loadURL('file://' + join(app.getAppPath(), 'dist', 'client.html'))
  }

  const ipcRenderer = new IPCAdapter(ipcMain, mainWindow.webContents)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  if (process.env.NODE_ENV === 'dev') {
    // require('electron-connect').client.create(mainWindow)
  }
})
