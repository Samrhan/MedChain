const {app, BrowserWindow} = require('electron')
const url = require("url");
const path = require("path");

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: 'src/favicon.ico',
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.setMenu(null);
  mainWindow.removeMenu();

  mainWindow.loadFile('dist/pharmacist/index.html');

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
