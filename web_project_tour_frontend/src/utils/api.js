class API {
    constructor(baseURL) {
      this._baseURL = baseURL;
    }
  
    get _headers() {
      const token = this._getToken();
      return {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
      };
  }

  get _token() {
      return this._getToken();
  }

  _getToken() {
      let token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
      return token; 
  }

  _removeToken() {
      localStorage.removeItem("jwt");
      sessionStorage.removeItem("jwt");
  }

  
    _checkResponse(response) {
        if (response.ok) {
          return response.json();
        }
        return response.json().then((error) => {
          return Promise.reject({
            status: response.status,
            message: error.message || "Unknown error",
          });
        });
      }
  
      getOffers() {
        return fetch(`${this._baseURL}/offers`, {
          method: "GET",
          headers: this._headers,
        })
          .then(this._checkResponse) 
          .then((offers) => {
            return offers; 
          })
          .catch((err) => {
            console.error("Erro em receber ofertas:", err);
            return Promise.reject(err);
          });
      }
      
  
      addOffer({ title, description, price, image }) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("image", image);
      
        return fetch(`${this._baseURL}/offers/create`, {
          method: "POST",
          headers: {authorization: `Bearer ${this._token}`},
          body: formData, 
        })
          .then(this._checkResponse)
          .then((newOffer) => {
            return newOffer;
          })
          .catch((err) => {
            console.error("Error creating offer:", err);
            return Promise.reject(err);
          });
      }      
      
    deleteOffer(offerId) {
        return fetch(`${this._baseURL}/offers/${offerId}/delete`, {
          method: "DELETE",
          headers: this._headers,
        })
          .then(this._checkResponse)
          .catch((err) => {
            console.error("Erro ao deletar oferta:", err);
            return Promise.reject(err);
          });
      }

      saveOfferChanges(data, offerId) {
        const formData = new FormData();
    
        if (data.title) formData.append("title", data.title);
        if (data.description) formData.append("description", data.description);
        if (data.price) formData.append("price", data.price);
        if (data.image instanceof File || data.image instanceof Blob) {
          formData.append("image", data.image);
      }
    
        return fetch(`${this._baseURL}/offers/${offerId}/edit`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${this._token}`,
            },
            body: formData,  
        })
        .then(this._checkResponse)
        .then((editedOffer) => {
            return editedOffer;
        })
        .catch((err) => {
            console.error("Error editing offer:", err);
            return Promise.reject(err);
        });
    }
    
  
    getTopReviews(limit) {
      return fetch(`${this._baseURL}/reviews/top/${limit}`, {
        method: "GET",
        headers: this._headers,
      })
        .then(this._checkResponse)
        .then((topReviews) => {
          return topReviews;
        })
        .catch((err) => {
          console.error("Erro ao receber as top reviews:", err);
          return Promise.reject(err);
        });
    };
  
    getAllReviews() {
        return fetch(`${this._baseURL}/reviews/all`, {
          method: "GET",
          headers: this._headers,
        })
          .then(this._checkResponse)
          .then((allReviews) => {
            return allReviews; 
          })
          .catch((err) => {
            console.error("Erro ao receber todas reviews:", err);
            return Promise.reject(err);
          });
      }      
    
      addReview({ title, description, rating, place }) {
        return fetch(`${this._baseURL}/reviews/add`, {
          method: "POST",
          headers: this._headers,
          body: JSON.stringify({ title, rating, description, place }),
        })
          .then(this._checkResponse)
          .then((newReview) => {
            return newReview; 
          })
          .catch((err) => {
            console.error("Erro ao adicionar review:", err);
            return Promise.reject(err);
          });
      }
  
    deleteReview(reviewId) {
      return fetch(`${this._baseURL}/reviews/${reviewId}/delete`, {
        method: "DELETE",
        headers: this._headers,
      })
        .then(this._checkResponse)
        .catch((err) => {
          console.error("Erro ao deletar Review:", err);
          return Promise.reject(err);
        });
    }
  
    editReview(data, reviewId) {
        return fetch(`${this._baseURL}/reviews/${reviewId}/edit`, {
          method: "PATCH",
          headers: this._headers,
          body: JSON.stringify(data), 
        })
          .then(this._checkResponse)
          .then((editedReview) => {
            return editedReview; 
          })
          .catch((err) => {
            console.error("Erro em editar Review:", err);
            return Promise.reject(err);
          });
      }
      
    createAdmin({ email, password }) {
      return fetch(`${this._baseURL}/admins/create`, {
        method: "POST",
        headers: this._headers,
        body: JSON.stringify({ email, password })
      })
        .then(this._checkResponse)
        .then((newAdmin) => {
          return newAdmin;
        })
        .catch((err) => {
          console.error("Erro ao criar admin:", err);
          return Promise.reject(err);
        });
    }
  
    deleteAdmin({ email, password}) {
        return fetch(`${this._baseURL}/admins/delete`, {
          method: "DELETE",
          headers: this._headers,
          body: JSON.stringify({ email, password })
        })
          .then(this._checkResponse)
          .then((res) => {
            return res;
          })
          .catch((err) => {
            console.error("Erro ao deletar admin:", err);
            return Promise.reject(err);
          });
      }

      login({ email, password }) {
        return fetch(`${this._baseURL}/admins/login`, {
          method: "POST",
          headers: this._headers,
          body: JSON.stringify({ email, password })
        })
          .then(this._checkResponse)
          .then((res) => {
            if (res.token) {
              return res.token; 
            } else {
              throw new Error("Token não encontrado na resposta");
            }
          })
          .catch((err) => {
            console.error("Erro ao fazer login:", err);
            return Promise.reject(err); 
          });
      }

      signup(email) {
        return fetch(`${this._baseURL}/emails/subscribe`, {
          method: "POST",
          headers: this._headers,
          body: JSON.stringify(email), 
        })
          .then(this._checkResponse)
          .then((response) => {
            return response;
          })
          .catch((err) => {
            console.error("Erro ao se inscrever:", err);
            return Promise.reject(err);
          });
      }      

      getTestToken() {
        return fetch(`${this._baseURL}/tester`, {
          method: "GET",
          headers: this._headers,
        }).then(this._checkResponse).then((res) => {
          if (res.token) {
            localStorage.setItem("jwt", res.token);
            return res.token;
          } else {
            throw new Error("Token não encontrado na resposta");
          }
        }).catch((err) => {
          console.error("Erro ao pegar token de teste: ", err);
          return Promise.reject(err);
        })

      }
  }
      
  const api = new API('http://localhost:3000');
  
  export default api;