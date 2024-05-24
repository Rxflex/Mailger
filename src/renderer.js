// renderer.js

const { ipcRenderer } = require('electron');

// Обработка ответа об успешной аутентификации и загрузке сообщений
ipcRenderer.on('messages-loaded', (event, messages) => {
    // Очистим содержимое окна и отобразим список сообщений
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = '';

    // Отображение каждого сообщения в списке
    messages.forEach((message) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
      <strong>From:</strong> ${message.from}<br>
      <strong>Subject:</strong> ${message.subject}<br>
      <strong>Date:</strong> ${message.date}<br>
      <strong>Body:</strong> ${message.body}
    `;
        messageList.appendChild(listItem);
    });
});

// Обработка ответа об ошибке аутентификации
ipcRenderer.on('login-failed', (event, errorMessage) => {
    // Отображение сообщения об ошибке
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = errorMessage;
});
