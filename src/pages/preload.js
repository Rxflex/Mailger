const { ipcRenderer} = require("electron");

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

ipcRenderer.on('alert', (event, title, message) => {
    window.api.messageMain("alert", title, message)
})