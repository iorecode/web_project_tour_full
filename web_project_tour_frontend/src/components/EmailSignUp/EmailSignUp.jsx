import { useState } from "react";
import Form from "../Form/Form";
import "./EmailSignUp.css";

function EmailSignUp({ onSignUp }) {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [signUpMessage, setSignUpMessage] = useState("Inscreva-se");

  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const handleEmailInputChange = (e) => {
    const inputValue = e.target.value;
    setEmail(inputValue);
    setIsEmailValid(emailRegex.test(inputValue));
  };

  const handleEmailInputBlur = () => {
    setIsFocused(true);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSignUp({ email: email }); 
      setSignUpMessage("Obrigado! Inscrição realizada com sucesso.");
      setEmail(""); 
      setIsEmailValid(false);
      setIsFocused(false);
    } catch (error) {
      console.error("Erro ao se inscrever:", error);
      setSignUpMessage("Erro ao realizar a inscrição.");
    }
  };

  const errorMessage =
    isFocused && !isEmailValid ? "Insira um email válido" : "";

  return (
    <section className="email">
      <Form
        formClass="email"
        onSubmit={handleEmailSubmit}
        title="INSCREVA-SE NA NOSSA NEWSLETTER!"
      >
        <input
          type="email"
          name="emailInput"
          placeholder="exemplo@email.com"
          className="email__form-input"
          value={email}
          onChange={handleEmailInputChange}
          onBlur={handleEmailInputBlur}
          required
        />
        <span
          className={`email__error ${
            errorMessage ? "email__error_visible" : "email__error_hidden"
          }`}
        >
          {errorMessage}
        </span>
        <button
          className="email__form-button"
          type="submit"
          disabled={!isEmailValid}
        >
          {signUpMessage}
        </button>
      </Form>
    </section>
  );
}

export default EmailSignUp;
