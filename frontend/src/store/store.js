import { configureStore } from '@reduxjs/toolkit';
import uiSlice from './uiSlice';
import voteSlice from './voteSlice';

const store = configureStore({
    reducer: {
        ui: uiSlice.reducer,
        vote: voteSlice.reducer,
    }
});

export default store;
