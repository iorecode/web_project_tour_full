import Popup from "../Popup/Popup.jsx"
import "./PopupWithOffer.css"
import "../Popup/Popup.css"

export default function PopupWithOffer({ offer, onClose, isOpen }){
    if (!offer) return null;


    return (
    <Popup isOpen={isOpen} specialClass={'offer-popup'}>
        <div className="offer-popup__container">
            <button className="popup__close-button" onClick={onClose}>
          &times;
         </button>
         <div className="offer-popup__image-container">
            <img src={offer.image} alt={offer.title} className="offer-popup__image" />
        </div>
            <h2 className="offer-popup__title">{offer.title}</h2>
            <p className="offer-popup__description">{offer.description}</p>
            <p className="offer-popup__price">Preço: {offer.price}</p>
            <a target="_blank" href="https://www.whatsapp.com/" className="offer-popup__anchor"><button className="offer-popup__button">Entrar em Contato</button></a>
      </div>
    </Popup>
    )
}