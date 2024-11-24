import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

// Reduxストアの作成
const store = configureStore({
  reducer: rootReducer,
});

// ストアの型エクスポート
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
