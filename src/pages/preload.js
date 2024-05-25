const { ipcRenderer } = require("electron");

function sendToBackend(page) {
    ipcRenderer.send(page, {value: JSON.stringify(document)});
}