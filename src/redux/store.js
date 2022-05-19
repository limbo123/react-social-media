import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import registerUser from "./reducers/auth/registerSlice";   
import themeReducer from "./reducers/theme/themeSlice"; 

const rootReducer = combineReducers({
    registerUser,
    themeReducer
});

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
    })
}