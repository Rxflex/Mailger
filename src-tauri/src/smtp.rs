use lettre::Message;
use lettre::transport::smtp::authentication::Credentials;
use lettre::transport::smtp::AsyncSmtpTransport;
use lettre::Tokio1Executor;

pub async fn send_email(user: &str, password: &str, smtp_server: &str, recipient: &str, subject: &str, body: &str) -> Result<(), Box<dyn std::error::Error>> {
    let email = Message::builder()
        .from(user.parse()?)
        .to(recipient.parse()?)
        .subject(subject)
        .body(body.to_string())?;

    let creds = Credentials::new(user.to_string(), password.to_string());

    let mailer = AsyncSmtpTransport::<Tokio1Executor>::relay(smtp_server)?
        .credentials(creds)
        .build();

    mailer.send(email).await?;
    Ok(())
}
