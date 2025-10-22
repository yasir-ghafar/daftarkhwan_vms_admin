import { BrowserRouter } from "react-router";
import AppRoutes from "./router/app_routes";
import LoginPage from "./features/auth/login_page";
import './App.css'
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </BrowserRouter>
  );
}


export default App;