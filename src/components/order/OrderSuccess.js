import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, hotelName, orderDetails } = location.state;

    const handleFinish = () => {
        navigate('/');
    };

    return (
        <div className="order-success-container">
            <h1>Create Order Successfully!</h1>
            <p>Order ID: {orderId}</p>
            <p>Hotel Name: {hotelName}</p>
            <h3>Order Details:</h3>
            <ul>
                {orderDetails.map((detail, index) => (
                    <li key={index}>
                        <p>Room Name: {detail.roomName}</p>
                        <p>Room Quantity: {detail.roomQuantity}</p>
                        <p>Price: {detail.price}</p>
                    </li>
                ))}
            </ul>
            <button onClick={handleFinish} className="finish-btn">Finish</button>
        </div>
    );
};

export default OrderSuccess;
