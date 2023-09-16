import HomePage from './HomePage';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import VideoCall from './components/calling';
import { useMyContext } from './alertContext';
import BasicAlerts from './components/alertComponent/alert';

const alertStyles = {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  zIndex: '9999', // Adjust the z-index value as needed
};

function App() {
  const { alertActive, alertMessage, alerttype } = useMyContext();
  return (
    <Router>
      <Routes>
        <Route
          path="/:section?/:id?/:index?/:clicked?/:showbutton?"
          element={
            <div>
              {' '}
              {alertActive && (
                <div style={alertStyles}>
                  <BasicAlerts message={alertMessage} alerttype={alerttype} />
                </div>
              )}
              <HomePage />
            </div>
          }
        />
        <Route
          path="/call/:senderid/:sender/:receiverid/:receiver/:which/:camera"
          element={<VideoCall />}
        />

        <Route
          path="/login"
          element={
            <div>
              {' '}
              {alertActive && (
                <div style={alertStyles}>
                  <BasicAlerts message={alertMessage} alerttype={alerttype} />
                </div>
              )}
              <LoginPage />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

{
  /** */
}
export default App;
