import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ userData, children }) => {
  return userData ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;