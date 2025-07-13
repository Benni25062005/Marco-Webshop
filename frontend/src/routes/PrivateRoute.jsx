import { useSelector } from "react-redux";
import {  Navigate} from "react-router-dom";

export default function PrivateRoute({ children}) {
    const token = useSelector((state) => state.auth.token);
    const loadingFromStorage = useSelector((state) => state.auth.loadingFromStorage);

    
    if (loadingFromStorage) {
        return <div className="text-center mt-10">Authentifizierung wird geprüft...</div>;
    }

    return token ? children : <Navigate to="/login" replace />;
}