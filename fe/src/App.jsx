import React, { useState } from 'react';
import Home from './Home';
import Login from './components/Login/Login';
import PaymentForm from './Cart/PaymentForm';
import Checkout from './Cart/Checkout';
import Profile from './Profile';
import Order from './Order';
import SignUp from './Signup';
import RequestReset from './RequestReset';
import ResetPassword from './ResetPassword';
import ForgotPassword from './ForgotPassword';
import Category from './Category';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './mainStyle.css';
import NavBar from './components/NavBar';
import Categories from './Categories';

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
          <Route path="/requestReset" element={<RequestReset />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/forgotPassword/:tokenId" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/category/:categoryId" element={<Category />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
