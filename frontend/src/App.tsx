import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [serverTime, setServerTime] = useState<number | null>(null);
  const [timeDifference, setTimeDifference] = useState<number>(0);
  const [loadingTime, setLoadingTime] = useState<boolean>(false);

  useEffect(() => {
    fetchServerTime();

    const timeInterval = setInterval(() => {
      setTimeDifference((prev) => prev + 1);
    }, 1000);

    const fetchInterval = setInterval(() => {
      fetchServerTime();
    }, 30000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(fetchInterval);
    };
  }, []);

  const fetchServerTime = async () => {
    setLoadingTime(true);
    try {
      const response = await axios.get('http://localhost:3000/time', {
        headers: { Authorisation: 'mysecrettoken' },
      });
      const epochTime = response.data.epoch;
      const clientTime = Math.floor(Date.now() / 1000);
      setServerTime(epochTime);
      setTimeDifference(Math.abs(clientTime - epochTime));
    } catch (error) {
      console.error('Error fetching server time:', error);
    } finally {
      setLoadingTime(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="App">
      <div className="section left-section">
        {loadingTime ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <h2>Server Time: {serverTime}</h2>
            <h3>Time Difference: {formatTime(timeDifference)}</h3>
          </>
        )}
      </div>
      <div className="section right-section">
        {/* Right section content */}
      </div>
    </div>
  );
}

export default App;
