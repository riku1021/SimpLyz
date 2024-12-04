import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Stateの型定義
interface ParameterState {
  vertical: string;
  horizontal: string;
  target: string;
  regression: string;
  dimension: string;
}

// 初期状態
const initialState: ParameterState = {
  vertical: "",
  horizontal: "",
  target: "",
  regression: "false",
  dimension: "",
};

// スライスの作成
const parameterSlice = createSlice({
  name: "parameter",
  initialState,
  reducers: {
    // variableの値を変更するアクション
    changeVertical(state, action: PayloadAction<string>) {
      state.vertical = action.payload;
    },

    // horizontalの値を変更するアクション
    changeHorizontal(state, action: PayloadAction<string>) {
      state.horizontal = action.payload;
    },

    // targetの値を変更するアクション
    changeTarget(state, action: PayloadAction<string>) {
      state.target = action.payload;
    },

    // regressionの値を変更するアクション
    changeRegression(state, action: PayloadAction<string>) {
      state.regression = action.payload;
    },

    // dimensionの値を変更するアクション
    changeDimension(state, action: PayloadAction<string>) {
      state.dimension = action.payload;
    },
  },
});

// アクションのエクスポート
export const {
  changeVertical,
  changeHorizontal,
  changeTarget,
  changeRegression,
  changeDimension,
} = parameterSlice.actions;

// デフォルトエクスポートとしてリデューサー関数をエクスポート
export default parameterSlice.reducer;
