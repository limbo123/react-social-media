import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentTheme: "light"
}

export const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        changeTheme: (state) => {
            if(state.currentTheme === "light") {
                state.currentTheme = "dark"
                localStorage.setItem("theme", "dark")
              }else {
                state.currentTheme = "light"
                localStorage.setItem("theme", "light")
              }
        },
        setInitialTheme: (state, { payload }) => {
            state.currentTheme = payload;
        }
    }
});

export default themeSlice.reducer;