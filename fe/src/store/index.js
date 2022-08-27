import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import Auth from "../reducers/auth.slice";
import Carts from "../reducers/carts.slice"

const rootReducer = combineReducers({
  // here we will be adding reducers
  Auth:Auth,
  Carts: Carts,
})

const store = configureStore({
  reducer:rootReducer,
})

export default store;