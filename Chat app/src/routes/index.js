import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Logout from "../pages/Logout";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children : [
            {
                path : "",
                element : <Home />
            },
            {
                path : "login",
                element : <Login />
            },
            {
                path : "signup",
                element : <Signup />
            },
            {
                path : "logout",
                element : <Logout />
            },
        ]
    }
])

export default router;