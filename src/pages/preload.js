const { ipcRenderer, dialog } = require("electron");

function sendToBackend(page) {
    let inputsraw, index;
    const inputs = {};
    inputsraw = document.getElementsByTagName('input');
    for (index = 0; index < inputsraw.length; ++index) {
        inputs[inputsraw[index].id] = inputsraw[index].value
    }
    ipcRenderer.send(page, {document: JSON.stringify(inputs)});
}

ipcRenderer.on('response', (event, message) => {
    eval(message);
})

ipcRenderer.on('alert', (event, message) => {
    alert(message);
})