mod imap;
mod smtp;

#[tauri::command]
async fn fetch_emails_command(user: &str, password: &str, imap_server: &str) -> Result<Vec<String>, String> {
    match imap::connect_to_imap(user, password, imap_server).await {
        Ok(mut session) => match imap::fetch_emails(&mut session).await {
            Ok(emails) => Ok(emails.into_iter().map(|msg| String::from_utf8_lossy(&msg.message).to_string()).collect()),
            Err(e) => Err(e.to_string()),
        },
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
async fn send_email_command(user: &str, password: &str, smtp_server: &str, recipient: &str, subject: &str, body: &str) -> Result<(), String> {
    smtp::send_email(user, password, smtp_server, recipient, subject, body)
        .await
        .map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![fetch_emails_command, send_email_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
