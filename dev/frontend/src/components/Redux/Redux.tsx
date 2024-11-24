import React from "react";
import { useSelector } from "react-redux";
import {
  selectVertical,
  selectHorizontal,
  selectTarget,
  selectRegression,
} from "../../features/parameter/parameterSelectors";
import { useDispatch } from "react-redux";
import { changeVertical } from "../../features/parameter/parameterSlice";

const Redux: React.FC = () => {
  const dispatch = useDispatch();

  const vertical = useSelector(selectVertical);
  const horizontal = useSelector(selectHorizontal);
  const target = useSelector(selectTarget);
  const regression = useSelector(selectRegression);

  return (
    <div>
      <h2>Parameters:</h2>
      <p>Vertical: {vertical}</p>
      <p>Horizontal: {horizontal}</p>
      <p>Target: {target}</p>
      <p>Regression: {regression}</p>
      <button onClick={() => dispatch(changeVertical("テスト"))}>
        verticalの値変更
      </button>
    </div>
  );
};

export default Redux;
