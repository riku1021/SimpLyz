import { RootState } from "../../app/store";

// roomIdの値を取得するセレクタ
export const selectRoomId = (state: RootState) => state.roomId.roomId;
