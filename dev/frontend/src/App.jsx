import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './components/Header';

import ManageCSV from './components/ManageCSV/ManageCSV';
import Fetch from './components/fetch';
import Analysis from './components/Analysis/Analysis';
import DataInfo from './components/DataInfo/DataInfo';
import ColumnDetail from './components/ColumnDetail/ColumnDetail';
import FeatureCreation from './components/FeatureCreation/FeatureCreation';
import MissingValueImputation from './components/MissingValueImputation/MissingValueImputation';
import DataAnalysis from './components/DataAnalysis/DataAnalysis';

function App() {
  return (
    <BrowserRouter>
      <Header>
        <Routes>
          <Route path='/' element={<ManageCSV />} />
          <Route path='/fetch' element={<Fetch />} />
          <Route path='/manage-csv' element={<ManageCSV />} />
          <Route path='/data-info' element={<DataInfo />} />
          <Route path="/data-info/:columnName/:type" element={<ColumnDetail />} />
          <Route path='/miss-input' element={<MissingValueImputation />} />
          <Route path='/feature-creation' element={<FeatureCreation />} />
          <Route path='/analysis' element={<Analysis />} />
          <Route path='/data-analysis' element={<DataAnalysis />} />
        </Routes>
      </Header>
    </BrowserRouter>
  );
}

export default App;
