import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Stateの型定義
interface ChartState {
  type: string;
}

// 初期状態
const initialState: ChartState = {
  type: "scatter",
};

// スライスの作成
const chartSlice = createSlice({
  name: "chart",
  initialState,
  reducers: {
    // 任意の値を追加するアクション
    changeChartType(state, action: PayloadAction<string>) {
      state.type = action.payload;
    },
  },
});

// アクションのエクスポート
export const { changeChartType } = chartSlice.actions;

// デフォルトエクスポートとしてリデューサー関数をエクスポート
export default chartSlice.reducer;
