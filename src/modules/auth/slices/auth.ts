import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { JWTTokenResponse } from '../interfaces/types'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {},
    tokenData: {
      access_token: "",
      expires_in: 0,
      token_type: ""
    }
  },
  reducers: {
    setTokenData: (state, action: PayloadAction<JWTTokenResponse>) => {
      state.tokenData = action.payload
    },
    loadTokenFromStorage: (state) => {
      const stringifiedData = localStorage.getItem('token_data');
      if (stringifiedData) {
        const jsonData: JWTTokenResponse = JSON.parse(stringifiedData);
        state.tokenData = jsonData;
      }
    }
  },
})

export const { setTokenData, loadTokenFromStorage } = authSlice.actions

export default authSlice.reducer