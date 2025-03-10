import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import Signup from "../pages/Signup";
import ProductDetails from "../pages/ProductDetails";
import AdminPanel from "../pages/AdminPanel";
import NotAuthorized from "../pages/NotAuthorized";
import Cart from "../pages/Cart";
import UserProfile from "../pages/UserProfile";
import CheckoutSuccess from "../pages/CheckoutSuccess";
import CategoryProds from "../pages/CategoryProds";
import OrderDetails from "../pages/OrderDetails";
import SearchResult from "../pages/SearchResult";

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
                path : "forgot-password",
                element : <ForgotPassword />
            },
            {
                path : "sign-up",
                element : <Signup />
            },
            {
                path : "admin",
                element : <AdminPanel />
            },
            {
                path : "products/:id",
                element : <ProductDetails />
            },
            {
                path : "not-authorized",
                element : <NotAuthorized />
            },
            {
                path : "cart",
                element : <Cart />
            },
            {
                path : "me",
                element : <UserProfile />
            },
            {
                path : "change-pass",
                element : <ForgotPassword />
            },
            {
                path : "checkout-success",
                element : <CheckoutSuccess />
            },
            {
                path : "categories/:category",
                element : <CategoryProds />
            },
            {
                path : "order/:id",
                element : <OrderDetails />
            },
            {
                path : "search",
                element : <SearchResult />
            },
            
        ]
    }
])

export default router;