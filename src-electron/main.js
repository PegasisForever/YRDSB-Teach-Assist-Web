const {app, BrowserWindow} = require('electron')

let mainWindow

function createWindow () {
    mainWindow = new BrowserWindow({
        icon:"./logo192.png",
        width: 1200,
        height: 800,
    })

    mainWindow.loadFile("../build/index.html")

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
