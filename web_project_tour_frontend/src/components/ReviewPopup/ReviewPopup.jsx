import './ReviewPopup.css';
import Popup from "../Popup/Popup";
import { useState } from 'react';

export default function ReviewPopup({ onClose, isOpen, onSubmit }) {
  const [reviewFormInfo, setReviewFormInfo] = useState({
    title: '',
    description: '',
    place: '',
    rating: ''
  });

  const renderStarRating = () => {
    const totalStars = 5;
    let stars = [];
    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= reviewFormInfo.rating ? "filled" : ""}`}
          onClick={() => handleStarClick(i)}
          style={{
            cursor: "pointer",
            fontSize: "2.8rem",
            color: i <= reviewFormInfo.rating ? "#FFD700" : "#d3d3d3"
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  function handleStarClick(starValue) {
    setReviewFormInfo((prevData) => ({
      ...prevData,
      rating: starValue,
    }));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setReviewFormInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior
    if (isFormComplete()) {
      try {
        onSubmit(reviewFormInfo);
        window.alert("Avaliação enviada com sucesso!");
        onClose();
      } catch (error) {
        window.alert("Ocorreu um erro ao enviar a avaliação. Tente novamente.");
      }
    } else {
      window.alert("Por favor, preencha todos os campos antes de enviar.");
    }
  }

  const isFormComplete = () => {
    return Object.values(reviewFormInfo).every((field) => field !== '');
  };

  return (
    <Popup isOpen={isOpen} specialClass="review-popup">
      <p className="review-popup__title">Deixe sua avaliação!</p>
      <div className="review-popup__container">
        <input
          name="title"
          type="text"
          placeholder="Título"
          value={reviewFormInfo.title}
          onChange={handleChange}
          className="review-popup__input review-popup__input-title"
        />
        <textarea
          name="description"
          type="text"
          placeholder="Descrição"
          value={reviewFormInfo.description}
          onChange={handleChange}
          className="review-popup__input review-popup__input-description"
        />
        <input
          name="place"
          type="text"
          placeholder="Destino da Viagem"
          value={reviewFormInfo.place}
          onChange={handleChange}
          className="review-popup__input review-popup__input-destination"
        />
        <div className="review-popup__rating-container">
          <p className="review-popup__rating-title">Avaliação:</p>
          <div className="review-popup__stars">{renderStarRating()}</div>
        </div>
        <button
          onClick={handleSubmit}
          className="review-popup__submit-button"
          disabled={!isFormComplete()} 
        >
          Salvar
        </button>
      </div>
    </Popup>
  );
}
