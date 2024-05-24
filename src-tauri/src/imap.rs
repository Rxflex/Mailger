use async_imap::Session;
use async_imap::error::Result;
use async_native_tls::TlsConnector;
use tokio::net::TcpStream;
use async_imap::types::Fetch;
use async_native_tls::TlsStream;

pub async fn connect_to_imap(user: &str, password: &str, imap_server: &str) -> Result<Session<TlsStream<TcpStream>>> {
    let tls = TlsConnector::new();
    let client = async_imap::connect((imap_server, 993), imap_server, tls).await?;
    let mut session = client.login(user, password).await.map_err(|e| e.0)?;
    Ok(session)
}

pub async fn fetch_emails(session: &mut Session<TlsStream<TcpStream>>) -> Result<Vec<Fetch>> {
    session.select("INBOX").await?;
    let messages = session.fetch("1:*", "RFC822").await?;
    let messages = messages.collect::<Vec<_>>();
    Ok(messages)
}
