import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "./registerActions";

const initialState = {
    isModalOpened: false,
    user: null,
    error: "",
}

export const registerSlice = createSlice({
    name: "register",
    initialState,
    reducers: {
        handleModal: (state, action) => {
            state.isModalOpened = action.payload; 
        },
        setError : (state, action) => {
            state.error = action.payload;
        }
    },
    extraReducers: {
        [registerUser.fulfilled]: (state, action) => {
            
            if(typeof action.payload === "string") {
                state.error = action.payload;
            }else {
                state.isModalOpened = false;
            }
        },
        [registerUser.rejected]: (state, action) => {
            state.error = action.error.message;
            console.log("error");
        },  
        [loginUser.fulfilled]: (state, action) => {
            console.log(action.payload);
            state.error = "";
            state.isModalOpened = false;
            state.user = action.payload.user
        },
        [loginUser.rejected]: (state, action) => {
            state.error = action.error.message;
        },  
    }
});

export default registerSlice.reducer;