import { useEffect, useState } from "react";
import Popup from "../Popup/Popup";
import "./AdminPopup.css";

export default function AdminPopup({ onCreate, onEdit, onDelete, action, onClose, isOpen, reviews, offers }) {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isInReviews, setIsInReviews] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [offerFormData, setOfferFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
  });
  const [reviewFormData, setReviewFormData] = useState({title:"", description:"", rating:0, place:""});
  const [popupTitle, setPopupTitle] = useState("Administração");
  const [isLoading, setIsLoading] = useState(false);

  const isReviewAction = action && action.toLowerCase().includes('review');
  const items = isReviewAction ? reviews : offers;

  useEffect(() => {
    const isReview = action.includes("review");
    setIsInReviews(isReview);

    if (!isCreating && action.includes("add")) {
      setIsCreating(true);
    }
  
    if (isReview) {
      if (isEditing) setPopupTitle("Editar avaliação");
      else if (isCreating) setPopupTitle("Criar avaliação");
      else setPopupTitle("Visualizando todas as avaliações");
    } else {
      if (isEditing) setPopupTitle("Editar oferta");
      else if (isCreating) setPopupTitle("Criar oferta");
      else setPopupTitle("Visualizando todas as ofertas");
    }
  }, [action, isEditing, isCreating]);

    function handleStarClick(starValue) {
    setReviewFormData((prevData) => ({
      ...prevData,
      rating: starValue,
    }));
  }

  // Renderizar as estrelas para a avaliação
  const renderStarRating = () => {
    const totalStars = 5;
    let stars = [];
    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= reviewFormData.rating ? "filled" : ""}`}
          onClick={() => handleStarClick(i)}
          style={{ cursor: "pointer", fontSize: "2rem", color: i <= reviewFormData.rating ? "#FFD700" : "#d3d3d3" }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  function handleCreateClick(){
    setIsCreating(true);
    if(isInReviews){
        setReviewFormData({title:"", description:"", rating:"", place:""})
    } else {
        setOfferFormData({title:"", description:"", price:"", image:""})
    }
  }

  function handleChange(e) {
    const { name, value, type, files } = e.target;
    
    if (isInReviews) {
      setReviewFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      if (type === "file") {
        const file = files[0];
        const maxSize = 12 * 1024 * 1024;
        if (file && file.size > maxSize) {
          alert("A imagem excede o limite de 12MB. Escolha uma menor.");
          return;
        }
        setOfferFormData((prev) => ({ ...prev, [name]: files[0] })); 
      } else {
        setOfferFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
  }

  function handleFormSubmit() {
    const formData = isInReviews ? reviewFormData : offerFormData;
    if (!formData.title || !formData.description) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }
  
    setIsLoading(true);
    const promise = isCreating
      ? onCreate(formData)
      : onEdit(formData);
  
    promise
      .then(() => {
        resetForm();
        alert(isCreating ? 'Item criado com sucesso!' : 'Item editado com sucesso!');
      })
      .catch((err) => {
        console.error(isCreating ? 'Erro ao criar item:' : 'Erro ao editar item:', err);
        alert('Erro ao salvar item. Tente novamente.');
      })
      .finally(() => setIsLoading(false));
  }

  function handleEditClick(item){
    setIsEditing(true);
    if(item.hasOwnProperty('rating')){
        setReviewFormData(item);
    } else {
        setOfferFormData(item);
    }
  }

  function handleDeleteClick(item) {
    const confirmDelete = window.confirm('Tem certeza de que deseja excluir este item?');
    if (!confirmDelete) return;
  
    onDelete(item)
      .then(() => alert('Item excluído com sucesso!'))
      .catch((err) => {
        console.error('Erro ao excluir item:', err);
        alert('Erro ao excluir item. Tente novamente.');
      });
  }
  

  function resetForm() {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedItem(null);
    setOfferFormData({title: "", description: "", price: "", image: ""});
    setReviewFormData({title: "", description: "", rating: "", place:""});
  }

  return (
    <Popup isOpen={isOpen} specialClass="admin-popup">
      <div className="admin-popup__upper-container">
        <p className="admin-popup__title">{popupTitle}</p>
        {(!isCreating && !isEditing) && (
          <button className="admin-popup__add-button" onClick={handleCreateClick}>+</button>
        )}
      </div>

      {(isCreating || isEditing) && (
        <form className="admin-popup__form" encType={isInReviews ? "" : "multipart/form-data"}>
          <input 
            name="title"
            type="text"
            placeholder="Título"
            value={isInReviews ? reviewFormData.title : offerFormData.title}
            onChange={handleChange}
            className="admin-popup__input admin-popup__input-title"
          />
          <textarea 
            name="description"
            type="text"
            placeholder="Descrição"
            value={isInReviews ? reviewFormData.description : offerFormData.description}
            onChange={handleChange}
            className="admin-popup__input admin-popup__input-description"
          />
          {isInReviews ? (
            <>
              <input 
                name="place"
                type="text"
                placeholder="Destino da Viagem"
                value={reviewFormData.place}
                onChange={handleChange}
                className="admin-popup__input admin-popup__input-data"
              />
              <div className="admin-popup__rating-container">
                <p className="admin-popup__rating-title">Avaliação:</p>
                <div className="admin-popup__stars">{renderStarRating()}</div>
              </div>
            </>
          ) : (
            <>
              <input 
                name="price"
                type="text"
                placeholder="Preço"
                value={offerFormData.price}
                onChange={handleChange}
                className="admin-popup__input admin-popup__input-data"
              />
              <input 
                type="file" 
                accept="image/*" 
                name="image"
                className="admin-popup__input admin-popup__input-image" 
                onChange={handleChange} 
              />
            </>
          )}
        <button 
        onClick={handleFormSubmit} 
        className="admin-popup__submit-button" 
        disabled={isLoading}
      >
        {isLoading ? 'Salvando...' : 'Salvar'}
      </button>
        </form>
      )}

      {!isCreating && !isEditing  && (
        <div className="admin-popup__item-container">
          {items.length === 0 ? (
            <p className="admin-popup__empty-message">Nenhum item disponível.</p>
          ) : (
            <ul className="admin-popup__list">
              {items.map((item, index) => (
                <li 
                  key={index} 
                  className="admin-popup__item"
                  onMouseEnter={() => setSelectedItem(item)}
                  onMouseLeave={() => setSelectedItem(null)}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="admin-popup__item-content">
                    <span className="admin-popup__item-title">{item.title}</span>
                    <span className="admin-popup__item-description">{item.description}</span>
                    <span className="admin-popup__item-data">{isInReviews ? item.rating : item.price}</span>
                  </div>
                  {selectedItem === item && (
                    <div className="admin-popup__actions">
                      <button 
                        className="admin-popup__edit" 
                        onClick={() => handleEditClick(selectedItem)}
                      >
                        Editar
                      </button>
                      <button 
                        className="admin-popup__delete" 
                        onClick={() => handleDeleteClick(selectedItem)}
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Popup>
  );
}