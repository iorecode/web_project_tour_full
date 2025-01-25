const ProtectedRoute = ({ isLoggedIn, children, onShowLogin, loading }) => {
  if (loading) {
    return null; 
  }

  if (!isLoggedIn) {
    onShowLogin();
    return null;
  }

  return children;
};

export default ProtectedRoute;
