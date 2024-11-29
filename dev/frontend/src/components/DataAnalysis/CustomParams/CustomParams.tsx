import { Button, Grid } from "@mui/material";
import Scatter from "./Scatter";
import Histogram from "./Histogram";
import Boxhidediagram from "./Boxhidediagram";
import PieChart from "./PieChart";
import { useSelector } from "react-redux";
import { selectType } from "../../../features/chart/chartSelectors";
import { useDispatch } from "react-redux";
import { changeChartType } from "../../../features/chart/chartSlice";

type CustomParamsProps = {
  setImage: (image: string) => void;
};

const CustomParams: React.FC<CustomParamsProps> = ({ setImage }) => {
  const dispatch = useDispatch();
  // chartTypeの取得
  const chartType = useSelector(selectType);

  const handleButtonClick = (chartType: string) => {
    dispatch(changeChartType(chartType));
  };

  return (
    <>
      <Grid container sx={{ marginTop: 2 }} spacing={2} justifyContent="center">
        <Grid item xs={5}>
          <Button
            variant={chartType === "scatter" ? "contained" : "outlined"}
            onClick={() => handleButtonClick("scatter")}
            fullWidth
            sx={{
              fontWeight: "bold",
              borderRadius: "50px",
              backgroundColor: chartType === "scatter" ? "#D75365" : "white",
              color: chartType === "scatter" ? "white" : "#D75365",
              borderColor: "#D75365",
              borderWidth: "2px",
            }}
          >
            散布図
          </Button>
        </Grid>
        <Grid item xs={5}>
          <Button
            variant={chartType === "histogram" ? "contained" : "outlined"}
            onClick={() => handleButtonClick("histogram")}
            fullWidth
            sx={{
              fontWeight: "bold",
              borderRadius: "50px",
              backgroundColor: chartType === "histogram" ? "#0883AF" : "white",
              color: chartType === "histogram" ? "white" : "#0883AF",
              borderColor: "#0883AF",
              borderWidth: "2px",
            }}
          >
            ヒストグラム
          </Button>
        </Grid>
        <Grid item xs={5}>
          <Button
            variant={chartType === "boxhidediagram" ? "contained" : "outlined"}
            onClick={() => handleButtonClick("boxhidediagram")}
            fullWidth
            sx={{
              fontWeight: "bold",
              borderRadius: "50px",
              backgroundColor:
                chartType === "boxhidediagram" ? "#2E8F75" : "white",
              color: chartType === "boxhidediagram" ? "white" : "#2E8F75",
              borderColor: "#2E8F75",
              borderWidth: "2px",
            }}
          >
            箱ひげ図
          </Button>
        </Grid>
        <Grid item xs={5}>
          <Button
            variant={chartType === "pieChart" ? "contained" : "outlined"}
            onClick={() => handleButtonClick("pieChart")}
            fullWidth
            sx={{
              fontWeight: "bold",
              borderRadius: "50px",
              backgroundColor: chartType === "pieChart" ? "#FFA500" : "white",
              color: chartType === "pieChart" ? "white" : "#FFA500",
              borderColor: "#FFA500",
              borderWidth: "2px",
            }}
          >
            円グラフ
          </Button>
        </Grid>
      </Grid>

      {/* 選択されたチャートに応じてチャートコンポーネントを表示 */}
      {chartType === "scatter" && <Scatter setImage={setImage} />}
      {chartType === "histogram" && <Histogram setImage={setImage} />}
      {chartType === "boxhidediagram" && <Boxhidediagram setImage={setImage} />}
      {chartType === "pieChart" && <PieChart setImage={setImage} />}
    </>
  );
};

export default CustomParams;
