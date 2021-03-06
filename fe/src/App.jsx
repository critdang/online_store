import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Home from './Home';
import Login from './components/Login/Login';
import PaymentForm from './Cart/PaymentForm';
import Checkout from './Cart/Checkout';
import Profile from './Profile';
import Order from './Order';
import SignUp from './Signup';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './mainStyle.css';
import NavBar from './components/NavBar';

function App() {
  const [login, setLogin] = useState(false);
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
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
