import { Button, Grid } from '@mui/material';
import Scatter from './Scatter';
import Histogram from './Histogram';
import Boxhidediagram from './Boxhidediagram';
import PieChart from './PieChart';

type CustomParamsProps = {
    setImage: (image: string) => void;
    setSelectChart: (chartType: string) => void;
    selectedChart: string;
};

const CustomParams = ({ setImage, setSelectChart, selectedChart }: CustomParamsProps) => {
    const handleButtonClick = (chartType: string) => {
        setSelectChart(chartType);
    };

    return (
        <>
            <Grid container sx={{ marginTop: 2 }} spacing={2} justifyContent="center">
                <Grid item xs={5}>
                    <Button
                        variant={selectedChart === 'scatter' ? "contained" : "outlined"}
                        onClick={() => handleButtonClick('scatter')}
                        fullWidth
                        sx={{
                            fontWeight: 'bold',
                            borderRadius: '50px',
                            backgroundColor: selectedChart === 'scatter' ? "#D75365" : 'white',
                            color: selectedChart === 'scatter' ? 'white' : '#D75365',
                            borderColor: '#D75365',
                            borderWidth: '2px',
                        }}
                    >
                        散布図
                    </Button>
                </Grid>
                <Grid item xs={5}>
                    <Button
                        variant={selectedChart === 'histogram' ? "contained" : "outlined"}
                        onClick={() => handleButtonClick('histogram')}
                        fullWidth
                        sx={{
                            fontWeight: 'bold',
                            borderRadius: '50px',
                            backgroundColor: selectedChart === 'histogram' ? "#0883AF" : 'white',
                            color: selectedChart === 'histogram' ? 'white' : '#0883AF',
                            borderColor: '#0883AF',
                            borderWidth: '2px',
                        }}
                    >
                        ヒストグラム
                    </Button>
                </Grid>
                <Grid item xs={5}>
                    <Button
                        variant={selectedChart === 'boxhidediagram' ? "contained" : "outlined"}
                        onClick={() => handleButtonClick('boxhidediagram')}
                        fullWidth
                        sx={{
                            fontWeight: 'bold',
                            borderRadius: '50px',
                            backgroundColor: selectedChart === 'boxhidediagram' ? "#2E8F75" : 'white',
                            color: selectedChart === 'boxhidediagram' ? 'white' : '#2E8F75',
                            borderColor: '#2E8F75',
                            borderWidth: '2px',
                        }}
                    >
                        箱ひげ図
                    </Button>
                </Grid>
                <Grid item xs={5}>
                    <Button
                        variant={selectedChart === 'pieChart' ? "contained" : "outlined"}
                        onClick={() => handleButtonClick('pieChart')}
                        fullWidth
                        sx={{
                            fontWeight: 'bold',
                            borderRadius: '50px',
                            backgroundColor: selectedChart === 'pieChart' ? "#FFA500" : 'white',
                            color: selectedChart === 'pieChart' ? 'white' : '#FFA500',
                            borderColor: '#FFA500',
                            borderWidth: '2px',
                        }}
                    >
                        円グラフ
                    </Button>
                </Grid>
            </Grid>

            {/* 選択されたチャートに応じてチャートコンポーネントを表示 */}
            {selectedChart === 'scatter' && <Scatter setImage={setImage} />}
            {selectedChart === 'histogram' && <Histogram setImage={setImage} />}
            {selectedChart === 'boxhidediagram' && <Boxhidediagram setImage={setImage} />}
            {selectedChart === 'pieChart' && <PieChart setImage={setImage} />}
        </>
    );
};

export default CustomParams;
