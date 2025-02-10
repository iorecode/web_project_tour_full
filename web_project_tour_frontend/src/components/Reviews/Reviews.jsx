import { useEffect, useState } from "react";
import "./Reviews.css"

function Reviews({ reviews }) {

  const [reviewArray, setReviewArray] = useState([]); 
   
  const getRandomReviews = () => {
    if(reviews.length){
    const shuffledReviews = [...reviews];  
    const selectedReviews = [];

    while (selectedReviews.length < 3 && shuffledReviews.length > 0) {
      const randomIndex = Math.floor(Math.random() * shuffledReviews.length);
      selectedReviews.push(shuffledReviews[randomIndex]);
      shuffledReviews.splice(randomIndex, 1); 
    }
    setReviewArray(selectedReviews); 
  }
  };

  useEffect(() => {
    getRandomReviews();
  }, []); 

  if (!reviews) return <p>Sem avaliações...</p>; 

  function renderReview(review) {
      const totalStars = 5;
      const filledStars = "★".repeat(review.rating); 
      const emptyStars = "☆".repeat(totalStars - review.rating);

    return (
      <div className="review">
        <div className="review__content">
        <p className="review__title">{review.title} - {review.place}</p>
        <p className="review__description">"{review.description}"</p>
        <p className="review__rating">{filledStars}{emptyStars}</p>
        </div>
      </div>
    );
  }

  return (
    <>
   <h2 className="reviews__title">Avaliações de clientes!</h2>
    <div className="reviews">
      {reviewArray.map((item, index) => (
        <div key={index}>
        {renderReview(item)}
      </div>
    ))}
    </div>
    </>
  );
}

export default Reviews;
