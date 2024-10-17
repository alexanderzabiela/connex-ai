import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import './App.css';

function App() {
  const [serverTime, setServerTime] = useState<number | null>(null);
  const [timeDifference, setTimeDifference] = useState<number>(0);
  const [loadingTime, setLoadingTime] = useState<boolean>(true);
  const [metrics, setMetrics] = useState<string>('');
  const [loadingMetrics, setLoadingMetrics] = useState<boolean>(true);

  useEffect(() => {
    fetchServerTime();
    fetchMetrics();

    const timeInterval = setInterval(() => {
      setTimeDifference((prev) => prev + 1);
    }, 1000);

    const fetchInterval = setInterval(() => {
      fetchServerTime();
      fetchMetrics();
    }, 30000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(fetchInterval);
    };
  }, []);

  const fetchServerTime = async () => {
    setLoadingTime(true); // Ensure loading spinner appears on every fetch
    try {
      const response = await axios.get('http://localhost:5000/time', {
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

  const fetchMetrics = async () => {
    setLoadingMetrics(true); // Ensure loading spinner appears on every fetch
    try {
      const response = await axios.get('http://localhost:5000/metrics', {
        headers: { Authorisation: 'mysecrettoken' },
      });
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoadingMetrics(false);
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
      <div className="section left-section loading-overlay">
        {loadingTime && (
          <div className="loading-spinner">
            <ClipLoader color="#000" loading={loadingTime} size={50} />
          </div>
        )}
        {!loadingTime && (
          <>
            <h2>Server Time: {serverTime}</h2>
            <h3>Time Difference: {formatTime(timeDifference)}</h3>
          </>
        )}
      </div>
      <div className="section right-section loading-overlay">
        {loadingMetrics && (
          <div className="loading-spinner">
            <ClipLoader color="#000" loading={loadingMetrics} size={50} />
          </div>
        )}
        {!loadingMetrics && <pre>{metrics}</pre>}
      </div>
    </div>
  );
}

export default App;
