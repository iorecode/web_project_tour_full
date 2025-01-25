import "./Nav.css";
import logo from '../../assets/OGlogo.png';
import { useNavigate } from "react-router-dom";


function Nav({ onSendReviewClick }) {
  const navigate = useNavigate();
  const handleNavigateAbout = (e) => {
    e.preventDefault();
    navigate("/sobre");
  };

  const handleSendReviewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSendReviewClick();
  }

  const handleNavigateMain = () => {
    navigate("/");
  };

  return (
    <div className="nav">
      <div className="nav__content">
      <img src={logo} alt="logo placeholder" className="nav__logo" onClick={handleNavigateMain} />
      <div className="nav__links">
      <a
        href=""
        aria-label="navegar para formulario de avaliação"
        className="nav__link"
        onClick={handleSendReviewClick}
      >
        Deixar avaliação
      </a>
      <a
        href=""
        aria-label="navegar para sobre nós"
        className="nav__link"
        onClick={handleNavigateAbout}
      >
        Sobre nós
      </a>
      </div>
    </div>
    </div>
  );
}

export default Nav;
