import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: null,
  role: null,
  userName: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    clearEmail: (state) => {
      state.email = null;
    },
    setRole: (state, action) =>{
      state.role = action.payload;
    },
    clearRole: (state) => {
      state.role = null;
    },
    setUserName: (state, action) =>{
      state.userName = action.payload;
    },
    clearUserName: (state)=>{
      state.userName = null;
    }
  },
});

export const { setEmail, clearEmail, setRole, clearRole , setUserName, clearUserName} = userSlice.actions;
export default userSlice.reducer;
