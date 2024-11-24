import { RootState } from "../../app/store";

// verticalの値を取得するセレクタ
export const selectVertical = (state: RootState) => state.parameter.vertical;

// horizontalの値を取得するセレクタ
export const selectHorizontal = (state: RootState) =>
  state.parameter.horizontal;

// targetの値を取得するセレクタ
export const selectTarget = (state: RootState) => state.parameter.target;

// regressionの値を取得するセレクタ
export const selectRegression = (state: RootState) =>
  state.parameter.regression;
