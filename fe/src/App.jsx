import React, { useState } from 'react'
import Button from '@mui/material/Button';
import Album from './Album';
import Login from './Login';
import PaymentForm from './Cart/PaymentForm';
import Checkout from './Cart/Checkout';
import Profile from './userProfile';
import Order from './Order';
import SignUp from './Signup';
import ForgotPassword from './ForgotPassword';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
 function App() {
  const[login,setLogin]= useState(false)
  console.log(login)
  return (
        // login?<Album/>: <Login login={login} setLogin={setLogin} />    
      <Router>
        <Routes>
          <Route exact path="/" element={<Login/>}/>
          <Route exact path="/album" element={<Album/>}/>
          <Route exact path="/paymentForm" element={<PaymentForm/>}/>
          <Route exact path="/checkout" element={<Checkout/>}/>
          <Route exact path="/profile" element={<Profile/>}/>
          <Route exact path="/order" element={<Order/>}/>
          <Route exact path="/signup" element={<SignUp/>}/>
          <Route exact path="/forgotPassword" element={<ForgotPassword/>}/>
          
        </Routes>
    </Router>
  )

}

export default App