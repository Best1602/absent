import { createSlice } from "@reduxjs/toolkit";

// import {rpList,frpList} from '../../constant/reportList'

const initialState = { userName: "", password: "" };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetLogin: (state, action) => {
      state.userName = "";
      state.password = "";
    },
    setUserName: (state, action) => {
      const { username, password } = action.payload;
      // state.userName = action.payload;
      state.userName = username;
      state.password = password;
      // console.log(action.payload);
      // state.password = action.payload;
    },
  },
});

export const { setUserName, resetLogin } = authSlice.actions;
export default authSlice.reducer;
