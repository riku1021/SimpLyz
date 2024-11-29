import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import { BACKEND_URL } from "../../../urlConfig";
import useAuth from "../../../hooks/useAuth";
import { useDispatch } from "react-redux";
import {
  changeDimension,
  changeHorizontal,
  changeRegression,
  changeTarget,
  changeVertical,
} from "../../../features/parameter/parameterSlice";

type PieChartProps = {
  setImage: (image: string) => void;
};

const PieChart: React.FC<PieChartProps> = ({ setImage }) => {
  const { csvId } = useAuth();
  const [variable, setVariable] = useState<string>("");
  const [variableList, setVariableList] = useState<string[]>([]);

  // redux
  const dispatch = useDispatch();

  // 使わない変数を初期化する
  useEffect(() => {
    dispatch(changeHorizontal(""));
    dispatch(changeTarget(""));
    dispatch(changeRegression(""));
    dispatch(changeDimension(""));
  }, [dispatch]);

  // 定性変数を取得
  useEffect(() => {
    const fetchVariable = async () => {
      try {
        const response = await axios.post(`${BACKEND_URL}/get_qualitative`, {
          csv_id: csvId,
        });
        const data = response.data;
        setVariableList(data.qualitative_variables);
        setVariable(data.qualitative_variables[0]);

        // redux
        dispatch(changeVertical(data.qualitative_variables[0]));
      } catch (error) {
        console.error("Error fetching qualitative variables:", error);
      }
    };

    fetchVariable();
  }, [csvId, dispatch]);

  // 画像データを取得
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.post(`${BACKEND_URL}/get_pie`, {
          csv_id: csvId,
          column_name: variable,
        });
        const data = response.data;
        setImage(data.image_data);
      } catch (error) {
        console.error("Error fetching pie chart image:", error);
      }
    };

    if (variable) {
      fetchImage();
    }
  }, [csvId, variable, setImage]);

  const changeVariable = (e: SelectChangeEvent<string>) => {
    setVariable(e.target.value);
    dispatch(changeVertical(e.target.value));
  };

  const formControlStyles = {
    width: "100%",
    maxWidth: "280px",
    margin: "0 auto",
  };

  const selectStyles = {
    fontSize: "20px",
    borderRadius: "50px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    "& .MuiSelect-icon": {
      fontSize: "24px",
    },
    "& .MuiSelect-select": {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
  };

  const inputPropsStyles = {
    padding: "10px 20px",
  };

  return (
    <Grid
      container
      spacing={3}
      sx={{ marginTop: 1, padding: 2, justifyContent: "center" }}
    >
      <Grid item>
        <Card
          variant="outlined"
          sx={{
            borderRadius: "50px",
            padding: 2,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            width: "300px",
          }}
        >
          <CardContent>
            <Typography variant="h5" sx={{ marginBottom: 2 }} gutterBottom>
              Parameters
            </Typography>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <FormControl variant="outlined" sx={formControlStyles}>
                  <InputLabel>Variable</InputLabel>
                  <Select
                    value={variable}
                    onChange={changeVariable}
                    label="Variable"
                    sx={selectStyles}
                    inputProps={{
                      sx: inputPropsStyles,
                    }}
                  >
                    {variableList.map((value, idx) => (
                      <MenuItem key={idx} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PieChart;
