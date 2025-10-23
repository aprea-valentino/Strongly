import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Contacto</h4>
          <p>Email: contacto@strongly.com</p>
          <p>Tel: +54 9 11 1234-5678</p>
        </div>
        <div className="footer-section">
          <h4>Redes Sociales</h4>
          <p>Instagram | Facebook | TikTok</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 STRONGLY. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
