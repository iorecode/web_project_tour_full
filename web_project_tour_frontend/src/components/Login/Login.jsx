import "./Login.css";
import Form from "../Form/Form";
import { useState } from "react";
import Popup from "../Popup/Popup";

function Login({ isOpen, onClose, onLoginSuccess, onReturnClick, onLogin, createTestAccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isRememberChecked, setIsRememberChecked] = useState(false);

  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  function handleEmailChange(e) {
    setEmail(e.target.value);
    setIsFormValid(emailRegex.test(e.target.value) && password.length >= 8);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
    setIsFormValid(emailRegex.test(email) && e.target.value.length >= 8);
  }

  function handleCheckboxChange(e) {
    setIsRememberChecked(e.target.checked);
  }

  function handleReturnClick(){
    onReturnClick();
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    
    if (!isFormValid) {
      return setErrorMessage("Email ou senha inválidos.");
    }
  
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
  
    try {
      const token = await onLogin({ email: cleanEmail, password: cleanPassword });
      if (token) {
        if (isRememberChecked) {
          localStorage.setItem("jwt", token);
        } else {
          sessionStorage.setItem("jwt", token);
        }
        setErrorMessage("");
        onLoginSuccess();
      } else {
        setErrorMessage("Email ou senha inválidos.");
      }
    } catch (error) {
      console.error("Erro durante o login:", error);
      setErrorMessage(error.message);
    }
  }

    function handleTestAccess() {
      const token = createTestAccess();
      if(token){
        if(isRememberChecked){
          localStorage.setItem("jwt", token)
        } else {
          // Store token in sessionStorage for session-based login
          sessionStorage.setItem("jwt", token);
        }
        setErrorMessage("");
        onLoginSuccess();
      }
    }

  return (
    <Popup isOpen={isOpen} onClose={onClose} specialClass={'login-popup'} >
    <section className="login">
      <Form formClass="login" title="Login">
        <input
          className="login__input"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="e-mail"
          required
        />
        <input
          className="login__input"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="senha"
          required
        />
        <input
          type="checkbox"
          className="login__checkbox_input"
          checked={isRememberChecked}
          onChange={handleCheckboxChange}
        />
        <label className="login__input-label">Manter-se conectado</label>
        <div className="login__button-container">
        <button
          type="submit"
          className="login__button"
          onClick={handleLoginSubmit}
        >
          Entrar
        </button>
        <button className="login__button login__button-return" onClick={handleReturnClick}>
          Voltar
        </button>
        <button className="login__button login__button-test" onClick={handleTestAccess}>
          Acesso de teste
        </button>
        </div>
        {errorMessage && <p className="login__error-message">{errorMessage}</p>}
      </Form>
    </section>
    </Popup>
  );
}

export default Login;
