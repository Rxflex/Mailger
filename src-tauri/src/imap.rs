use async_imap::Session;
use tokio::net::TcpStream;
use tokio_native_tls::TlsConnector;
use native_tls::TlsConnector as NativeTlsConnector;

pub async fn connect_to_imap(user: &str, password: &str, imap_server: &str) -> Result<Session<tokio_native_tls::TlsStream<TcpStream>>, Box<dyn std::error::Error>> {
    let tls_connector = NativeTlsConnector::builder().build()?;
    let tls_connector = TlsConnector::from(tls_connector);

    let tcp_stream = TcpStream::connect((imap_server, 993)).await?;
    let tls_stream = tls_connector.connect(imap_server, tcp_stream).await?;

    let client = async_imap::connect((imap_server, 993), imap_server, tls_stream).await?;
    let session = client.login(user, password).await.map_err(|e| e.0)?;

    Ok(session)
}
