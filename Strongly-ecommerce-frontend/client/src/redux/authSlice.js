import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, logout as logoutService } from "../services/authService";
import jwt_decode from "jwt-decode";

// token inicial desde localStorage (persistencia)
const storedToken = localStorage.getItem("token");

let initialUser = null;
if (storedToken) {
  const decoded = jwt_decode(storedToken);
  initialUser = {
    id: decoded.id,
    email: decoded.sub,
    role: decoded.rol,
  };
}

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
      const data = await login(email, password);
      return data;
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
      return await register(userData);
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: storedToken || null,
    user: initialUser,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      logoutService();
      state.token = null;
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        const token = action.payload.access_token;
        const decoded = jwt_decode(token);

        state.token = token;
        state.user = {
          id: decoded.id,
          email: decoded.sub,
          role: decoded.rol,
        };

        // persistencia
        localStorage.setItem("token", token);
        localStorage.setItem("id", decoded.id);
        localStorage.setItem("email", decoded.sub);
        localStorage.setItem("role", decoded.rol);
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;

        // Opcional: loguear automáticamente después del registro
        const token = action.payload.access_token;
        const decoded = jwt_decode(token);

        state.token = token;
        state.user = {
          id: decoded.id,
          email: decoded.sub,
          role: decoded.rol,
        };

        localStorage.setItem("token", token);
        localStorage.setItem("id", decoded.id);
        localStorage.setItem("email", decoded.sub);
        localStorage.setItem("role", decoded.rol);
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
