// Load in our dependencies
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;

// When all windows have closed, exit (even on OS X)
app.on('window-all-closed', () => {
  app.quit();
});

// When our app is ready, launch our browser window
app.on('ready', function handleReady () {
  // Create our browser window
  let browserWindow = new BrowserWindow({
    width: 800,
    height: 600
  });
  browserWindow.loadURL('file://' + __dirname + '/renderer.html');
});
