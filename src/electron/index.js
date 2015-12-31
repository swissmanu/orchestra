var app = require('app')
var BrowserWindow = require('browser-window')
var ipcMain = require('electron').ipcMain

// Report crashes to our server.
require('crash-reporter').start()

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')()
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null

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
  mainWindow = new BrowserWindow({width: 1600, height: 800})

  require('./ipcadapter')(ipcMain, mainWindow.webContents)

  // and load the index.html of the app.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadUrl('http://localhost:8080/hot-dev-app.html')
    mainWindow.openDevTools()
  } else {
    mainWindow.loadUrl('file://' + __dirname + '/../client/app.html')
  }

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
