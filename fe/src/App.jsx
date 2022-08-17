import React, { useState } from 'react';
import Home from './components/home';
import Login from './components/login';
import PaymentForm from './components/cart/PaymentForm';
import Checkout from './components/cart/Checkout';
import Profile from './components/profile';
import Order from './components/order';
import SignUp from './components/signup';
import RequestReset from './components/reset-password/RequestReset';
import ResetPassword from './components/reset-password/ResetPassword';
import ForgotPassword from './components/forgot-password';
import Category from './components/category';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './mainStyle.css';
import NavBar from './components/navbar/index';
import Categories from './components/categories';
import VerifyUser from './components/verify-user';
function App() {
  const [itemCart, setItemCart] = useState(0);

  //ham tang cap
  const addItemCart = () => {
    setItemCart(itemCart + 1);
    console.log(itemCart);
  };
  return (
    // login?<Album/>: <Login login={login} setLogin={setLogin} />
    <>
      <BrowserRouter>
        <NavBar itemCart={itemCart} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home addToCart={addItemCart} />} />
          <Route path="/paymentForm" element={<PaymentForm />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order" element={<Order />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/requestReset" element={<RequestReset />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/verify/:tokenId" element={<VerifyUser />} />
          <Route path="/forgotPassword/:tokenId" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/category/:categoryName:categoryId"
            element={<Category />}
          />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
