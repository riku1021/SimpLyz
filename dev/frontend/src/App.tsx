import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './components/Header';

import UserForm from './components/UserForm/UserForm';
import ManageCSV from './components/ManageCSV/ManageCSV';
import Fetch from './components/fetch';
import DataInfo from './components/DataInfo/DataInfo';
import ColumnDetail from './components/ColumnDetail/ColumnDetail';
import FeatureCreation from './components/FeatureCreation/FeatureCreation';
import MissingValueImputation from './components/MissingValueImputation/MissingValueImputation';
import DataAnalysis from './components/DataAnalysis/DataAnalysis';
import UserInfo from './components/UserInfo/UserInfo';
import Test from './database/Test';

const App: React.FC = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Header>
        <Routes>
          <Route path="/" element={<UserForm />} />
          <Route path="/fetch" element={<Fetch />} />
          <Route path="/manage-csv" element={<ManageCSV />} />
          <Route path="/data-info" element={<DataInfo />} />
          <Route path="/data-info/:columnName/:type" element={<ColumnDetail />} />
          <Route path="/miss-input" element={<MissingValueImputation />} />
          <Route path="/feature-creation" element={<FeatureCreation />} />
          <Route path="/data-analysis" element={<DataAnalysis />} />
          <Route path="/user-info" element={<UserInfo />} />
          {/* データベース・テスト用 */}
          <Route path="/test-db" element={<Test />} />
        </Routes>
      </Header>
    </BrowserRouter>
  );
};

export default App;
