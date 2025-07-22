import { BrowserRouter } from "react-router";
import AppRoutes from "./router/app_routes";
import LoginPage from "./features/auth/login_page";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
  );
}


export default App;