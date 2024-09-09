import React, { useState } from 'react';
import Custom from './Custom';
import './Analysis.css';
import Plt from './Plt';
import Chat from './Chat';

function Analysis() {
  const [scatter, setScatter] = useState(true);
  const [histogram, setHistogram] = useState(false);
  const [boxhidediagram, setBoxhidediagram] = useState(false);
  const [pieChart, setPieChart] = useState(false);
  const [image, setImage] = useState('');

  const selectionScatter = () => {
    setScatter(true);
    setHistogram(false);
    setBoxhidediagram(false);
    setPieChart(false);
  };

  const selectionHistogram = () => {
    setScatter(false);
    setHistogram(true);
    setBoxhidediagram(false);
    setPieChart(false);
  };

  const selectionBoxhidediagram = () => {
    setScatter(false);
    setHistogram(false);
    setBoxhidediagram(true);
    setPieChart(false);
  };

  const selectionPieChart = () => {
    setScatter(false);
    setHistogram(false);
    setBoxhidediagram(false);
    setPieChart(true);
  };

  return (
    <div className='analysis-wrapper'>
      <Custom
        selectionScatter={selectionScatter}
        selectionHistogram={selectionHistogram}
        selectionBoxhidediagram={selectionBoxhidediagram}
        selectionPieChart={selectionPieChart}
        scatter={scatter}
        histogram={histogram}
        boxhidediagram={boxhidediagram}
        pieChart={pieChart}
        setImage={setImage}
      />
      <Plt image={image} />
      <Chat image={image} />
    </div>
  );
}

export default Analysis;
