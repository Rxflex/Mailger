use async_imap::Session;
use async_native_tls::TlsStream;
use tokio::net::TcpStream;
use async_native_tls::TlsConnector;

async fn connect_to_imap(user: &str, password: &str, imap_server: &str) -> Result<Session<TlsStream<TcpStream>>, Box<dyn std::error::Error>> {
    let tls_connector = TlsConnector::new();
    let tcp_stream = TcpStream::connect((imap_server, 993)).await?;
    let tls_stream = tls_connector.connect(imap_server, tcp_stream).await?;
    let client = async_imap::connect((imap_server, 993), tls_stream).await?;
    let session = client.login(user, password).await.map_err(|e| e.0)?;
    Ok(session)
}
