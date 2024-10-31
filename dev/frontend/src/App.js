import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ManageCSV from './components/ManageCSV/ManageCSV';
import Fetch from './components/fetch';
import Analysis from './Analysis/Analysis';
import DataInfo from './components/DataInfo/DataInfo';
import ColumnDetail from './components/ColumnDetail/ColumnDetail';
import FeatureCreation from './components/FeatureCreation/FeatureCreation';
import MissingValueImputation from './components/MissingValueImputation/MissingValueImputation';

import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<ManageCSV />} />
        <Route path='/fetch' element={<Fetch />} />
        <Route path='/manage-csv' element={<ManageCSV />} />
        <Route path='/data-info' element={<DataInfo />} />
        <Route path="/data-info/:columnName/:type" element={<ColumnDetail />} />
        <Route path='/miss-input' element={<MissingValueImputation />} />
        <Route path='/feature-creation' element={<FeatureCreation />} />
        <Route path='/analysis' element={<Analysis />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
