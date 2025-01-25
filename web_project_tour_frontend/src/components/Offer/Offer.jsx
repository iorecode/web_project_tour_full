import "./Offer.css";
import ReusableCarousel from "../Carousel/Carousel";

function Offer({ offerClickHandling, offers }) {

  const handleOfferClick = (e) => {
    const offerDiv = e.currentTarget;
    const title = offerDiv.querySelector('.offer__title').textContent;
    const description = offerDiv.querySelector('.offer__description').textContent;
    const price = offerDiv.querySelector('.offer__price').textContent;
    const image = offerDiv.querySelector('.offer__image').src;

    offerClickHandling({ title, description, price, image });
  };


  const renderOffer = (offer) => {
    return(
      <div className="offer" onClick={handleOfferClick}>
      <img src={offer.image[0].url} alt={offer.title} className="offer__image" />
      <div className="offer__details">
        <p className="offer__title">{offer.title}</p>
        <p className="offer__description">{offer.description}</p>
        <p className="offer__price">R${offer.price}</p>
        <button className="offer__button">Interessado?</button>
      </div>
    </div>
      )
  } 

  if (!offers.length) return <p className="offer__empty-text">Nenhuma oferta disponível no momento</p>; // gotta change this afterwards

  return (
    <div>
      <h2 className="offer__section-title">Ofertas</h2>
      <ReusableCarousel items={offers} renderItem={renderOffer}/>
    </div>
  );
}

export default Offer;
