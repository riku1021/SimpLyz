import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Stateの型定義
interface roomIdState {
  roomId: string;
}

// 初期状態
const initialState: roomIdState = {
  roomId: "",
};

// スライスの作成
const roomIdSlice = createSlice({
  name: "roomId",
  initialState,
  reducers: {
    // 任意の値を追加するアクション
    changeRoomId(state, action: PayloadAction<string>) {
      state.roomId = action.payload;
    },
  },
});

// アクションのエクスポート
export const { changeRoomId } = roomIdSlice.actions;

// デフォルトエクスポートとしてリデューサー関数をエクスポート
export default roomIdSlice.reducer;
