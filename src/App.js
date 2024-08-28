import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "./components/home/Home";
import Header from './components/header/Header';
import CreateOrder from './components/order/CreateOrder';
import OrderSuccess from './components/order/OrderSuccess';
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
  }

  useEffect(() => {
    getHotels();
  }, [])

  return (
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home hotels={hotels} />} />
          <Route path="/create-order" element={<CreateOrder />} />
          <Route path="/order-success" element={<OrderSuccess />} /> {}
        </Routes>
      </div>
  );
}

export default App;
