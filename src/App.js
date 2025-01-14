import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "./components/home/Home";
import Header from './components/header/Header';
import HotelDetails from './components/home/HotelDetails';
import OfferDetails from "./components/home/OfferDetails";
import api from './api/axiosConfig';

function App() {
  const [hotels, setHotels] = useState([]);

  const getHotels = async () => {
    try {
      const response = await api.get("/hotels");
      console.log(response.data);
      setHotels(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getHotels();
  }, []);

  return (
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home hotels={hotels} />} />
          <Route path="/hotel-details/:hotelName" element={<HotelDetails />} />
          <Route path="/offer-details" element={<OfferDetails />} />
        </Routes>
      </div>
  );
}

export default App;

