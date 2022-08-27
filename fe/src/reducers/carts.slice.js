import { createSlice, current } from "@reduxjs/toolkit";

const initialState = [];

export const Cart = createSlice({
    name: "Cart",
    initialState,
    reducers: {
        cartItem: (_state, action) => {
          return action.payload;
        },
        addNewItem: (state, action) => {      
         
        //  const newState =  current(state);
         const newState =  [...state];
         newState.push(action.payload)
         return newState
        },
        deleteItem: (state, action) => {
          let newState = current(state);
          newState = newState.filter(item => {return item.productId != action.payload})
          return newState;
        },
        clearCart: (state, action) => {
          return [];
        },
    },
});

export const { cartItem, addNewItem, deleteItem, clearCart } = Cart.actions;
export default Cart.reducer;
