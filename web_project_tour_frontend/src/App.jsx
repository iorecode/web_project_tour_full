import "./App.css";
import Email from "./components/EmailSignUp/EmailSignUp";
import Footer from "./components/Footer/Footer";
import Nav from "./components/Nav/Nav";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Dashboard from "./components/Dashboard/Dashboard"
import About from "./components/About/About"
import Login from "./components/Login/Login"
import { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PopupWithOffer from "./components/PopupWithOffer/PopupWithOffer";
import AdminPopup from "./components/AdminPopup/AdminPopup";
import ReviewPopup from "./components/ReviewPopup/ReviewPopup";
import api from "./utils/api";

function App() {
  const [isAnyPopupOpen, setIsAnyPopupOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminPopupOpen, setIsAdminPopupOpen] = useState(false)
  const [adminPopupAction, setAdminPopupAction] = useState('')
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false)
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [topReviews, setTopReviews] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offers, reviews, topReviews] = await Promise.all([
          getAllOffers().catch((error) => {
            return []; 
          }),
          getAllReviews().catch((error) => {
            return []; 
          }),
          getTopReviews().catch((error) => {
            return []; 
          }),
        ]);
        
        setOffers(offers);
        setReviews(reviews);
        setTopReviews(topReviews);
  
        const token = localStorage.getItem("jwt");
        if (token && !isLoggedIn) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Erro pegando dados iniciais:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [isLoggedIn]);
  

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginPopupOpen(false);
    setIsAnyPopupOpen(false);
    navigate("/dashboard")
  }

  const handleSendReviewClick = () => {
    setIsReviewPopupOpen(true);
    setIsAnyPopupOpen(true);
  }

  const handleLoginReturnClick = () => {
    setIsLoginPopupOpen(false);
    setIsAnyPopupOpen(false);
  }

  const handleCreateAdminSubmit = async ({ email, password }) => {
    try{
    const createAdminResponse = await api.createAdmin({ email, password });
    return createAdminResponse
    } catch(error){
      console.error("Erro ao criar admin:", error)
      throw error
    }
  }

  const handleDeleteAdminSubmit = async ({ email, password }) => {
    try {
      const deleteAdminResponse = await api.deleteAdmin({ email, password});
      return deleteAdminResponse
    } catch(error) {
      console.error("Erro ao deletar admin: ", error )
      throw error
    }
  }

  const handleEmailSignUp = async (email) => {
    try {
      await api.signup(email); 
    } catch (error) {
      console.error("Erro ao inscrever:", error);
      throw error;
    }
  };

  const getAllOffers = async () => {
    try {
      const allOffers = await api.getOffers(); 
      return allOffers; 
    } catch (error) {
      console.error("Erro pegando ofertas:", error);
      throw error; 
    }
  };
  

  const getTopReviews = async () => {
    try{
      const topReviews = await api.getTopReviews(3);
      return topReviews
    } catch (error) {
      console.error("Erro ao pegar reviews:", error);
      throw error;
    }
   }

   const getAllReviews = async () => {
    try {
      const allReviews = await api.getAllReviews();
      return allReviews
    } catch (error) {
      console.error("Erro ao pegar reviews:", error);
      throw error;
    }
   }

  const pageOpacity = isAnyPopupOpen ? "app-main_background" : "app-main_foreground";

  const handleOfferClick = (offer) => {
    setSelectedOffer(offer);
    setIsAnyPopupOpen(true);
  };
  
  const handleAdminPopupOpenClick = (action) => {
    setAdminPopupAction(action);
    setIsAdminPopupOpen(true);
    setIsAnyPopupOpen(true);
  }

  const handleLogoutClick = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("jwt");
  }

  const closePopup = () => {
    setIsAnyPopupOpen(false);
    setSelectedOffer(null);
    setIsLoginPopupOpen(false);
    setIsAdminPopupOpen(false);
    setAdminPopupAction('');
    setIsReviewPopupOpen(false)
  };

  const handleOutsideClick = () => {
    if (isAnyPopupOpen) {
      closePopup();
    }
  };

  const handleCreateReview = (data) => {
    const newReview = api.addReview(data);
    return newReview
  };

  const handleDeleteOffer = (id) => {
    api.deleteOffer(id)
      .then(() => {
        setOffers((prevOffers) => prevOffers.filter((offer) => offer._id !== id)); 
        alert("Oferta excluída com sucesso!");
      })
      .catch((err) => {
        console.error("Erro ao excluir oferta:", err);
        alert("Erro ao excluir oferta. Tente novamente.");
      });
  };
  

  const handleDeleteReview = (id) => {
    api.deleteReview(id)
      .then(() => {
        setReviews((prevReviews) => prevReviews.filter((review) => review._id !== id));
        setTopReviews((prevTopReviews) => prevTopReviews.filter((review) => review._id !== id)); 
        alert("Avaliação excluída com sucesso!");
      })
      .catch((err) => {
        console.error("Erro ao excluir avaliação:", err);
        alert("Erro ao excluir avaliação. Tente novamente.");
      });
  };
  

  const handleLoginSubmit = async ({ email, password }) => {
    try{
      await api.login({ email, password}).then((res) => {return res})
    }
    catch(error){
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  }

  const handleCreateTestToken = async () => {
      const testToken = await api.getTestToken()
      return testToken
  }

  const isRestrictedPage = location.pathname === "/dashboard";

  return (
    <>
      <div className={"app-main " + pageOpacity} onClick={handleOutsideClick}>
        {!isRestrictedPage && <Nav onSendReviewClick={handleSendReviewClick} />}
        {!isRestrictedPage && <Header />}
        <Routes>
          <Route path="/sobre" element={<About />} />
          <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              loading={loading}
              onShowLogin={() => setIsLoginPopupOpen(true)}
            >
              <Dashboard onLogoutClick={handleLogoutClick} onOpenAdminPopup={handleAdminPopupOpenClick} onCreateAdmin={handleCreateAdminSubmit} onDeleteAdmin={handleDeleteAdminSubmit} />
            </ProtectedRoute>
          }
        />
          <Route path="*" element={<Main onOfferClick={handleOfferClick} offers={offers} reviews={topReviews} loading={loading} />} />
        </Routes>
        {!isRestrictedPage && <Email onSignUp={handleEmailSignUp} />}
        {!isRestrictedPage && <Footer isLoggedIn={isLoggedIn} onShowLogin={() => {setIsLoginPopupOpen(true); setIsAnyPopupOpen(true)}} />}
      </div>
      {isLoginPopupOpen && <Login isOpen={isAnyPopupOpen} onClose={closePopup} onLoginSuccess={handleLoginSuccess} onReturnClick={handleLoginReturnClick} onLogin={handleLoginSubmit} createTestAccess={handleCreateTestToken} />}
      {selectedOffer && (
        <PopupWithOffer offer={selectedOffer} onClose={closePopup} isOpen={isAnyPopupOpen} />
      )}
       {isAdminPopupOpen && (
        <AdminPopup action={adminPopupAction} onClose={closePopup} reviews={reviews} offers={offers} isOpen={isAnyPopupOpen} onCreate={(data) => {
          if (data.rating) {
            return api.addReview(data);
          } else {
            return api.addOffer(data);
          }
        }}
        onEdit={(data) => {
          const { _id, ...restData } = data;
          if (data.rating) {    
            return api.editReview(restData, _id);
          } else {
            return api.saveOfferChanges(restData, _id);
          }
        }}
        onDelete={(item) => {
          if (item.rating) {
            handleDeleteReview(item._id);
          } else {
            handleDeleteOffer(item._id);
          }
        }}
         />
      )}
       {isReviewPopupOpen && (
        <ReviewPopup onClose={closePopup} isOpen={isAnyPopupOpen} onSubmit={handleCreateReview} />
      )}
    </>
  );
}

export default App;
