import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import filesReducer from './file'

export const store = configureStore({
    reducer: {
        user: userReducer,
        files: filesReducer
    },
});

export default store;