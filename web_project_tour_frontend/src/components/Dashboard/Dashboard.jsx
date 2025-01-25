import "./Dashboard.css";
import Form from "../Form/Form.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ onOpenAdminPopup, onLogoutClick, onCreateAdmin, onDeleteAdmin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const navigate = useNavigate();
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(emailRegex.test(value));
  };

  const handleEmailInputBlur = () => {
    setIsEmailFocused(true);
  };

  const handlePasswordInputBlur = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setIsPasswordValid(passwordRegex.test(value));
  };

  const handleCreateAdminSubmit = (e) => {
    e.preventDefault();
    onCreateAdmin({ email, password })
      .then(() => {
        alert("Item criado com sucesso!");
        setEmail("");
        setPassword("");
      })
      .catch((err) => {
        console.error("Erro ao criar admin", err.message);
        alert(`Erro ao criar Admin. ${err.message}`);
      });
  };

  const handleDeleteAdminSubmit = (e) => {
    e.preventDefault();
    onDeleteAdmin({ email, password })
      .then(() => {
        alert("Admin deletado com sucesso!");
        setEmail("");
        setPassword("");
      })
      .catch((err) => {
        console.error("Erro ao deletar admin", err.message);
        alert(`Erro ao deletar Admin. ${err.message}`);
      });
  };

  const handleLogoutClick = () => {
    onLogoutClick();
    navigate("/");
  };

  const areFieldsInvalid = !isEmailValid || !isPasswordValid;
  const emailErrorMessageDisplay =
    isEmailFocused && !isEmailValid
      ? "dashboard__error_visible"
      : "dashboard__error_hidden";
  const passwordErrorMessageDisplay =
    isPasswordFocused && !isPasswordValid
      ? "dashboard__error_visible"
      : "dashboard__error_hidden";

  const handleDashboardClick = () => {
    if (isPopupOpen) {
      setIsPopupOpen(false); 
    }
  };

  const handlePopupClick = (e) => {
    e.stopPropagation(); 
  };

  return (
    <section className="dashboard" onClick={handleDashboardClick}>
      <div className="dashboard__item dashboard__offers">
        <p className="dashboard__title">Ofertas</p>
        <button
          className="dashboard__button-add dashboard__button"
          onClick={() => {
            setIsPopupOpen(true);
            onOpenAdminPopup("add offer");
          }}
          disabled={isPopupOpen}
        >
          Adicionar Oferta
        </button>
        <button
          className="dashboard__button-edit dashboard__button"
          onClick={() => {
            setIsPopupOpen(true);
            onOpenAdminPopup("offer");
          }}
          disabled={isPopupOpen}
        >
          Visualizar Ofertas
        </button>
      </div>

      <div className="dashboard__item dashboard__reviews">
        <p className="dashboard__title">Avaliações</p>
        <button
          className="dashboard__button-add dashboard__button"
          onClick={() => {
            setIsPopupOpen(true);
            onOpenAdminPopup("add review");
          }}
          disabled={isPopupOpen}
        >
          Adicionar Avaliação
        </button>
        <button
          className="dashboard__button-edit dashboard__button"
          onClick={() => {
            setIsPopupOpen(true);
            onOpenAdminPopup("review");
          }}
          disabled={isPopupOpen}
        >
          Visualizar Avaliações
        </button>
      </div>

      <div className="dashboard__item dashboard__form">
        <Form
          title="Adicionar conta de administrador"
          formClass="dashboard-fieldset"
          onSubmit={handleCreateAdminSubmit}
        >
          <div onClick={handlePopupClick}>
            <input
              className="dashboard__input"
              type="email"
              value={email}
              onInput={handleEmailChange}
              onBlur={handleEmailInputBlur}
              placeholder="E-MAIL"
              required
            />
            <p
              className={
                "dashboard__error dashboard__error-email " +
                emailErrorMessageDisplay
              }
            >
              Insira um email válido.
            </p>
            <input
              className="dashboard__input"
              type="password"
              value={password}
              onInput={handlePasswordChange}
              onBlur={handlePasswordInputBlur}
              placeholder="SENHA"
              required
            />
            <p
              className={
                "dashboard__error dashboard__error-password " +
                passwordErrorMessageDisplay
              }
            >
              Insira uma senha com 8 ou mais caracteres, contendo pelo menos um
              número
            </p>

            <button
              disabled={areFieldsInvalid || isPopupOpen}
              onClick={handleCreateAdminSubmit}
              className="dashboard__button-create"
            >
              Criar conta de administrador
            </button>
            <button
              disabled={areFieldsInvalid || isPopupOpen}
              onClick={handleDeleteAdminSubmit}
              className="dashboard__button-delete"
            >
              Deletar conta de administrador
            </button>
          </div>
        </Form>
      </div>

      <button
        className="dashboard__button-logout"
        onClick={handleLogoutClick}
        disabled={isPopupOpen}
      >
        Sair
      </button>
      <button
        className="dashboard__button-leave"
        onClick={() => navigate("/")}
        disabled={isPopupOpen}
      >
        Voltar
      </button>
    </section>
  );
}

export default Dashboard;
