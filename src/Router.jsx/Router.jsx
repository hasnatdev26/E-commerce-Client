import { createBrowserRouter } from "react-router-dom";

/* ================= LAYOUT ================= */
import Main from "../Layout/Main";

/* ================= PUBLIC ================= */
import Home from "../Pages/HomePage/Home";
import LoginForm from "../Authentication/LoginFrom";
import SignupFrom from "../Authentication/SignupFrom";
import ProductDetails from "../Components/Card/ProductDetails";
import CategoryProducts from "../Components/CategoryProducts/CategoryProducts";
import SearchResults from "../Components/SearchResults/SearchResults";
import AllProducts from "../Pages/AllProducts/AllProducts";

/* ================= USER ================= */
import WishList from "../Pages/HomePage/WishList/WishList";
import Cart from "../Pages/HomePage/Cart/Cart";
import Checkout from "../Components/Checkout/Checkout";
import SingleCheckout from "../Components/Checkout/SingleCheckout";
import SuccessPage from "../Components/SuccessPage/SuccessPage";
import PaymentFail from "../Components/PaymentFail/PaymentFail";
import PaymentCancel from "../Components/PaymentCancel/PaymentCancel";
import MyOrders from "../Pages/Dashboard/UsersPages/MyOrders/MyOrders";

/* ================= ADMIN ================= */
import AddProduct from "../Pages/Dashboard/AdminPages/AddProduct/AddProduct";
import Dashboard from "../Pages/Dashboard/AdminPages/Dashboard/Dashboard";
import Inventory from "../Pages/Dashboard/AdminPages/Inventory/Inventory";
import EditProduct from "../Pages/Dashboard/AdminPages/Inventory/EditeProduct";
import ManageOrders from "../Pages/Dashboard/AdminPages/ManageOrders/ManageOrders";
import OrderDetails from "../Pages/Dashboard/AdminPages/ManageOrders/OrderDetails";

/* ================= ROUTE GUARDS ================= */
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import ChangePassword from "../Pages/ChangePassword/ChangePassword";
import Contact from "../Pages/ContactUs/Contact";
import About from "../Pages/About/About";
import ForgotPassword from "../Authentication/ForgotPassword";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      /* ============ PUBLIC ROUTES ============ */
      { index: true, element: <Home /> },
      { path: "login", element: <LoginForm /> },
      { path: "sign-up", element: <SignupFrom /> },
      { path: "product-details/:id", element: <ProductDetails /> },
      { path: "category/:category", element: <CategoryProducts /> },
      { path: "search", element: <SearchResults /> },
      { path: "all-products", element: <AllProducts /> },
      { path: "contact-Us", element: <Contact /> },
      { path: "about", element: <About /> },

      /* ============ USER PRIVATE ============ */
      {
        path: "wishlist",
        element: (
          <PrivateRoute>
            <WishList />
          </PrivateRoute>
        ),
      },
      {
        path: "cart",
        element: (
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        ),
      },
      {
        path: "checkout",
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        ),
      },
      {
        path: "single-checkout",
        element: (
          <PrivateRoute>
            <SingleCheckout />
          </PrivateRoute>
        ),
      },
      {
        path: "success",
        element: (
          <PrivateRoute>
            <SuccessPage />
          </PrivateRoute>
        ),
      },
      {
        path: "payment-fail",
        element: (
          <PrivateRoute>
            <PaymentFail />
          </PrivateRoute>
        ),
      },
      {
        path: "payment-cancel",
        element: (
          <PrivateRoute>
            <PaymentCancel />
          </PrivateRoute>
        ),
      },
      {
        path: "purchase-history",
        element: (
          <PrivateRoute>
            <MyOrders />
          </PrivateRoute>
        ),
      },
      {
        path: "change-password",
        element: (
          <PrivateRoute>
            <ChangePassword />
          </PrivateRoute>
        ),
      },

      {
        path: "/forgot-password",
        element: <ForgotPassword />
      },


      /* ============ ADMIN PRIVATE ============ */
      {
        path: "admin/dashboard",
        element: (
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        ),
      },
      {
        path: "admin/add-products",
        element: (
          <AdminRoute>
            <AddProduct />
          </AdminRoute>
        ),
      },
      {
        path: "admin/inventory",
        element: (
          <AdminRoute>
            <Inventory />
          </AdminRoute>
        ),
      },
      {
        path: "admin/edit-products/:id",
        element: (
          <AdminRoute>
            <EditProduct />
          </AdminRoute>
        ),
      },
      {
        path: "admin/manage-orders",
        element: (
          <AdminRoute>
            <ManageOrders />
          </AdminRoute>
        ),
      },
      {
        path: "admin/manage-orders/:id",
        element: (
          <AdminRoute>
            <OrderDetails />
          </AdminRoute>
        ),
      },
    ],
  },
]);
