import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        onLogout: () => {
            localStorage.removeItem("persist:root");
            return null;
        },
        onLogin: (_state, action) => {
            return action.payload.login;
        },
    },
});

export const { onLogout, onLogin } = authSlice.actions;
export default authSlice.reducer;
