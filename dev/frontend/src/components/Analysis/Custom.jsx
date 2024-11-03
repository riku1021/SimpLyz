import './Analysis.css';
import './Custom.css';
import Scatter from './Scatter';
import Histogram from './Histogram';
import Boxhidediagram from './Boxhidediagram';
import PieChart from './PieChart';

function Custom({ selectionScatter, selectionHistogram, selectionBoxhidediagram, selectionPieChart, scatter, histogram, boxhidediagram, pieChart, setImage }) {
	return (
		<div className='custom-wrapper'>
			<div className='plt-selection'>
				<div className='selection-wrapper'>
					<div className='scatter-button' onClick={selectionScatter}>
						<p>Scatter</p>
					</div>
					<div className='histogram-button' onClick={selectionHistogram}>
						<p>Histogram</p>
					</div>
					<div className='boxhidediagram-button' onClick={selectionBoxhidediagram}>
						<p>Box-Hide</p>
					</div>
					<div className='piechart-button' onClick={selectionPieChart}>
						<p>Pie Chart</p>
					</div>
				</div>
			</div>
			{scatter && <Scatter setImage={setImage} />}
			{histogram && <Histogram setImage={setImage} />}
			{boxhidediagram && <Boxhidediagram setImage={setImage} />}
			{pieChart && <PieChart setImage={setImage} />}
		</div>
	);
}

export default Custom;
