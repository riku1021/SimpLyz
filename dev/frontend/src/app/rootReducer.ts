import { combineReducers } from "@reduxjs/toolkit";
import chartReducer from "../features/chart/chartSlice";
import parameterReducer from "../features/parameter/parameterSlice";
import roomIdReducer from "../features/roomId/roomIdSice";

const rootReducer = combineReducers({
  chart: chartReducer, // "chart" スライスを統合
  parameter: parameterReducer, // "parameter" スライスを統合
  roomId: roomIdReducer,
});

export default rootReducer;
