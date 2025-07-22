import { Navigate } from "react-router-dom";
import { auth } from "../utils/firebase";

const ProtectedRoute = ({ condition, redirectTo = "/", children }) => {
    if (!auth.currentUser || !condition) {
        return <Navigate to={redirectTo} replace />;
    }
    return children;
};

export default ProtectedRoute;
