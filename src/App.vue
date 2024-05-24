<template>
  <div id="app">
    <h1>Mailger</h1>
    <button @click="fetchEmails">Fetch Emails</button>
    <ul>
      <li v-for="email in emails" :key="email">{{ email }}</li>
    </ul>
    <button @click="sendEmail">Send Email</button>
  </div>
</template>

<script>
import { invoke } from '@tauri-apps/api/tauri'

export default {
  data() {
    return {
      emails: [],
    }
  },
  methods: {
    async fetchEmails() {
      try {
        this.emails = await invoke('fetch_emails_command', { user: 'your-email@example.com', password: 'yourpassword', imapServer: 'imap.example.com' });
      } catch (e) {
        console.error(e);
      }
    },
    async sendEmail() {
      try {
        await invoke('send_email_command', { user: 'your-email@example.com', password: 'yourpassword', smtpServer: 'smtp.example.com', recipient: 'recipient@example.com', subject: 'Test', body: 'Hello World' });
      } catch (e) {
        console.error(e);
      }
    }
  }
}
</script>

<style>
/* Добавь стили для своего приложения */
</style>
