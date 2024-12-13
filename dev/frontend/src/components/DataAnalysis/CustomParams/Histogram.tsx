import { useEffect, useState } from "react";
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
  Box,
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

type HistogramProps = {
  setImage: (image: string) => void;
};

const Histogram: React.FC<HistogramProps> = ({ setImage }) => {
  const { csvId } = useAuth();
  const [variable, setVariable] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [variableList, setVariableList] = useState<string[]>([]);
  const [targetList, setTargetList] = useState<string[]>([]);

  // redux
  const dispatch = useDispatch();

  // 使わない変数を初期化する
  useEffect(() => {
    dispatch(changeHorizontal(""));
    dispatch(changeRegression(""));
    dispatch(changeDimension(""));
  }, [dispatch]);

  // 定量変数を取得
  useEffect(() => {
    const fetchVariable = async () => {
      try {
        const response = await axios.post(`${BACKEND_URL}/get_quantitative`, {
          csv_id: csvId,
          a: 0,
        });
        const data = response.data;
        setVariableList(data.quantitative_variables);
        setVariable(data.quantitative_variables[0]);

        // redux
        dispatch(changeVertical(data.quantitative_variables[0]));
      } catch (error) {
        console.error("Error fetching quantitative variables:", error);
      }
    };

    // 定性変数を取得
    const fetchTarget = async () => {
      try {
        const response = await axios.post(`${BACKEND_URL}/get_qualitative`, {
          csv_id: csvId,
        });
        const data = response.data;
        const targets = [...data.qualitative_variables, "None"];
        setTarget("None");
        setTargetList(targets);

        // redux
        dispatch(changeTarget("None"));
      } catch (error) {
        console.error("Error fetching qualitative variables:", error);
      }
    };

    fetchTarget();
    fetchVariable();
  }, [csvId, dispatch]);

  // 画像データを取得
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.post(`${BACKEND_URL}/hist`, {
          csv_id: csvId,
          variable,
          target,
        });
        const data = response.data;
        setImage(data.image_data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching histogram image:", error);
      }
    };

    if (variable && target) {
      fetchImage();
    } else {
      setImage("null");
    }
  }, [csvId, variable, target, setImage]);

  const handleChangeVariable = (e: SelectChangeEvent<string>) => {
    setVariable(e.target.value);
    dispatch(changeVertical(e.target.value));
  };
  const handleChangeTarget = (e: SelectChangeEvent<string>) => {
    setTarget(e.target.value);
    dispatch(changeTarget(e.target.value));
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
            {variableList.length < 1 ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h5" gutterBottom>
                  データがありません
                </Typography>
              </Box>
            ) : (
              <>
                <Typography variant="h5" sx={{ marginBottom: 2 }} gutterBottom>
                  Parameters
                </Typography>
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <FormControl variant="outlined" sx={formControlStyles}>
                      <InputLabel>Variable</InputLabel>
                      <Select
                        value={variable}
                        onChange={handleChangeVariable}
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
                  <Grid item>
                    <FormControl variant="outlined" sx={formControlStyles}>
                      <InputLabel>Target</InputLabel>
                      <Select
                        value={target}
                        onChange={handleChangeTarget}
                        label="Target"
                        sx={selectStyles}
                        inputProps={{
                          sx: inputPropsStyles,
                        }}
                      >
                        {targetList.map((value, idx) => (
                          <MenuItem key={idx} value={value}>
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </>
            )}
            
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Histogram;
