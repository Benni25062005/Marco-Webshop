import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit';
import axios from 'axios';
import { UsersIcon } from 'lucide-react';

export const registerUser = createAsyncThunk(
    "user/register",
    async (userData, { rejectWithValue  }) => {
        try {
            const res = await axios.post("http://localhost:8800/api/user", userData, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            return res.data;
        } catch (error) {
            console.error("API Error:", error);
            return rejectWithValue(error.response?.data || "Etwas ist schiefgelaufen");

        }
    }
);

export const updateContact = createAsyncThunk(
  "user/updateContact",
  async (userData, { rejectWithValue }) => {
    try {
      

      const res = await axios.put(
        `http://localhost:8800/user/${userData.id}/contact`,
        userData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Gesendet an:", `http://localhost:8800/user/${userData.id}/contact`);
      return res.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message || error);
      return rejectWithValue(error.response?.data || "Etwas ist schiefgelaufen");
    }
  }
);

export const updateAdress = createAsyncThunk(
  "user/updateAdress",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.put(`http://localhost:8800/user/${userData.id}/address`, userData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data || "Etwas ist schiefgelaufen");
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (userData, { rejectWithValue}) => {
    try {
      const res = await axios.put(`http://localhost:8800/user/${userData.id}/password`, userData, {
        headers: { "Content-Type": "application/json" },
        
      });
      return res.data;
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data || "Etwas ist schiefgelaufen");
    }
  }
)

export const updateEmail = createAsyncThunk(
  "user/updateEmail",
  async (userData, { rejectWithValue}) => {
    try {
      const res = await axios.put(`http://localhost:8800/user/${userData.id}/email`, userData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      console.error("API Error:", err);
      return rejectWithValue(err.response?.data || "Etwas ist schiefgelaufen");
    }
    
  }
)

export const sendSms = createAsyncThunk(
  "user/sendSms",
  async (userData, { rejectWithValue }) => {
    try{
      const res = await axios.post(`http://localhost:8800/api/send-sms-code`, userData, {
          headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch(err) {
      console.error("API error", err);
      return rejectWithValue(err.response?.data ||"Etwas ist schiefgelaufen");
    }
    
  }
)

export const verifySms = createAsyncThunk(
  "user/verifySms",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`http://localhost:8800/api/verify-sms-code`, userData, {
          headers: { "Content-Type": "application/json" },
      })
      return res.data;
    } catch (err) {
      console.error("API error", err);
      return rejectWithValue(err.response?.data ||"Etwas ist schiefgelaufen");
    }
  }
)



export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:8800/user/${id}`);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fehler beim Laden");
    }
  }
);


const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null,
        status: null,
        error: null,
    },
    reducers: {
      setUser: (state, action) => {
        state.currentUser = action.payload;
      }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = "success";
                state.currentUser = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(sendSms.pending, (state) => {
                state.smsStatus = "loading";
            })
            .addCase(sendSms.fulfilled, (state, action) => {
                state.smsStatus = "success";
                state.smsMessage = action.payload.message;
            })
            .addCase(sendSms.rejected, (state, action) => {
                state.smsStatus = "error";
                state.smsError = action.payload;
            })
            .addCase(verifySms.pending, (state) => {
                state.verifyStatus = "loading";
            })
            .addCase(verifySms.fulfilled, (state) => {
                state.verifyStatus = "success";
                if (state.user) {
                  state.user.isVerifiedPhone = true;
                }
            })
            .addCase(verifySms.rejected, (state, action) => {
                state.verifyStatus = "error";
                state.verifyError = action.payload;
            })
          }
      })

export default userSlice.reducer;
export const { setUser } = userSlice.actions;