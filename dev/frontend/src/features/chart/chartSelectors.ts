import { RootState } from "../../app/store";

// typeの値を取得するセレクタ
export const selectType = (state: RootState) => state.chart.type;
