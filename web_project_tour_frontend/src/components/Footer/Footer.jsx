import "./Footer.css";
import { useNavigate } from "react-router-dom";

function Footer({ onShowLogin, isLoggedIn }) {
  const navigate = useNavigate();

  const handleNavigateDashboard = (e) => {
    if (!isLoggedIn) {
      e.preventDefault(); 
      onShowLogin();
    } else {
      navigate('/dashboard'); 
    }
  };

  const handleNavigateSobre = () => {
    navigate("/sobre");
  };

  return (
    <footer className="footer">
      <div className="footer__content">
      <div className="footer__block">
        <p className="footer__heading">Redes Sociais</p>
        <a className="footer__text footer__link" target="_blank" href="https://www.instagram.com/">
          <i className="fab fa-instagram footer__icon"></i> Instagram
        </a>
        <a className="footer__text footer__link" target="_blank" href="https://www.facebook.com/">
          <i className="fab fa-facebook footer__icon"></i> Facebook
        </a>
      </div>
      <div className="footer__block">
        <p className="footer__heading">Contato</p>
        <p className="footer__text">email@bigtrue.com.br</p>
        <p
          className="footer__text footer__link"
          onClick={handleNavigateSobre}
        >
          Sobre nós
        </p>
      </div>
      <div className="footer__block">
        <p className="footer__heading">Endereço</p>
        <p className="footer__text">Rua dos Posseiros, Salvador, BA</p>
        <p className="footer__text">CEP 41905-745</p>
      </div>
      <p
        className="footer__text footer__link footer__link-admin"
        onClick={handleNavigateDashboard}
      >
        Painel de Admin
      </p>
      </div>
    </footer>
  );
}

export default Footer;
