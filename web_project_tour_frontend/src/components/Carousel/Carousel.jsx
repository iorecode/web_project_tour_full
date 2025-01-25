import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./Carousel.css";
import rightArrow from "../../assets/right-arrow.svg"
import leftArrow from "../../assets/left-arrow.svg"

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3, 
  },
  tablet: {
    breakpoint: { max: 1300, min: 464 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const CustomLeftArrow = ({ onClick }) => {
    return (
      <button className="carousel__custom-arrow carousel__custom-arrow_left" onClick={onClick}>
        <img src={leftArrow} alt="Left Arrow" className="carousel__custom-arrow-image" />
      </button>
    );
  };
  
  const CustomRightArrow = ({ onClick }) => {
    return (
      <button className="carousel__custom-arrow carousel__custom-arrow_right" onClick={onClick}>
        <img src={rightArrow} alt="Right Arrow" className="carousel__custom-arrow-image" />
      </button>
    );
  };

function ReusableCarousel({ items, renderItem }) {
  const deviceType = window.innerWidth <= 1024 ? "mobile" : "desktop"; 

  return (
    <Carousel
      customLeftArrow={<CustomLeftArrow />}
      customRightArrow={<CustomRightArrow />}
      responsive={responsive}
      swipeable={deviceType === "mobile"} 
      draggable={deviceType === "mobile"}
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={4800}
      keyBoardControl={true} 
      removeArrowOnDeviceType={["tablet", "mobile"]} 
      containerClass="carousel-container"
      itemClass="carousel-item-padding-40-px"
      dotListClass="carousel__dot-list"
      ssr={true}
      showDots={true}
    >
      {items.map((item, index) => (
        <div key={index}>
          {renderItem(item)}
        </div>
      ))}
    </Carousel>
  );
}

export default ReusableCarousel;
