import { useState } from "react";
import Offer from "../Offer/Offer";
import Reviews from "../Reviews/Reviews"
import Spinner from "../Spinner/Spinner";
import "./Main.css";
import "../Offer/Offer.css"
import "../Reviews/Reviews.css"
import "../../blocks/Loading.css";

function Main({ onOfferClick, offers, reviews, loading }) {
  const [error, setError] = useState(null);
  const loadingClass = loading ? "loading_active" : "loading_disabled";
  
    if (loading) {
      return <Spinner isLoading={loading} />;
    }
  
    if (error) {
      return <p>Erro: {error}</p>;
    }
  

  return (
    <div className="main">
      <section className="offers-section">
        <Offer offerClickHandling={onOfferClick} offers={offers} />
      </section>
      {reviews.length && <section className="reviews-section">
        <Reviews reviews={reviews} />
      </section>}
    </div>
  );
}

export default Main;
