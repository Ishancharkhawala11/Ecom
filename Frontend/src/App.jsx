import { Route, Routes,Navigate } from "react-router-dom";
import "./App.css";
import Layout from "./components/auth/layout";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import AdminLayout from "./components/admin/Layout";
import AdminDashBoard from "./pages/admin/DashBoard";
import AdminProduct from "./pages/admin/Product";
import AdminFeature from "./pages/admin/Feature";
// import AdminOrder from "./components/admin/Order";
import ShoppingLayout from "./components/shopping/Layout";
import NotFound from "./pages/notFound/NotFound";
import ShoopingHome from "./pages/shopping/Home";
import ShoppingListing from "./pages/shopping/Listing";
import ShoppingCheckout from "./pages/shopping/Checkout";
import ShoppingAccount from "./pages/shopping/account";
import Check_auth from "./components/common/Check_auth";
import Unauth_page from "./pages/unauth_page/Unauth_page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
// isAuthenticated
import { Skeleton } from "@/components/ui/skeleton"
import Shopping_order from "./pages/admin/Shopping_order";
import Paypal_return from "./pages/shopping/paypal_return";
import Payment_success from "./pages/shopping/payment_success";
import Search_Product from "./pages/shopping/Search_page";
import Forgot_password from "./pages/auth/Forgot_password";
import Otp_verfy from "./pages/auth/Otp_verfy";
import Update_password from "./pages/auth/Update_password";
import { Loader } from "lucide-react";
import AdminNotification from "./pages/admin/Notification";
// import ContactUs from "./components/shopping/ContactUs";
import AboutUs from "./pages/shopping/AboutUs";

import ContactUs from "./pages/shopping/ContactUs";
import PrivatePolicy from "./pages/shopping/PrivatePolicy";

function App() {
  // const isAuthenticated = false;
  // const user = {
  //   name:"",
  //   role:""
  // };
  const {isAuthenticated,user,isLoading}=useSelector(state=>state.auth)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  if(isLoading){
    return<div className="flex items-center justify-center min-h-screen bg-white">
    <Loader className="animate-spin text-gray-700" size={50} />
  </div>
  }
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
      <Route path="/" element={<Navigate to="/auth/register" />} />

        <Route
          path="/auth"
          element={
            <Check_auth isAuthenticated={isAuthenticated} user={user}>
              <Layout></Layout>
            </Check_auth>
          }
        >
          <Route path="login" element={<Login></Login>}></Route>
          <Route path="register" element={<Register></Register>}></Route>
          <Route path="forgot" element={<Forgot_password/>}></Route>
          <Route path="otp" element={<Otp_verfy/>}></Route>
          <Route path="reset-password" element={<Update_password/>}></Route>
        </Route>
        <Route
          path="/admin"
          element={
            <Check_auth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout></AdminLayout>
            </Check_auth>
          }
        >
          <Route path="dashboard" element={<AdminDashBoard />}></Route>
          <Route path="products" element={<AdminProduct />}></Route>
          <Route path="features" element={<AdminFeature />}></Route>
          <Route path="orders" element={<Shopping_order />}></Route>
          <Route path="notification" element={<AdminNotification/>}></Route>
        </Route>

        <Route
          path="/shop"
          element={
            <Check_auth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout></ShoppingLayout>
            </Check_auth>
          }
        >
          <Route path="home" element={<ShoopingHome />}></Route>
          <Route
            path="listing"
            element={<ShoppingListing></ShoppingListing>}
          ></Route>{" "}
          <Route
            path="checkout"
            element={<ShoppingCheckout></ShoppingCheckout>}
          ></Route>
          <Route
            path="account"
            element={<ShoppingAccount></ShoppingAccount>}
          ></Route>
          <Route
            path="search"
            element={<Search_Product/>}
          ></Route>
          <Route path="paypal-return" element={<Paypal_return/>} />
          <Route path="payment-success" element={<Payment_success/>} />
          <Route path="contact" element={<ContactUs/>} />
          <Route path="about" element={<AboutUs/>} />
          <Route path="policy" element={<PrivatePolicy/>} />
        </Route>

        <Route path="*" element={<NotFound></NotFound>}></Route>
        <Route path="/unauth-page" element={<Unauth_page></Unauth_page>}></Route>
      </Routes>
    </div>
  );
}

export default App;
