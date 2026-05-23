import { Navigate, Route } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import routes from "@/config/routes";

const ProtectedRoutes = ({ children, allowedRoles }) => {
  const { isLoggedIn, user } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to={routes.auth.login} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={routes.customer.home} />;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
