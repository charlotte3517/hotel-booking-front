import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import './CreateOrder.css';

const CreateOrder = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const roomName = queryParams.get('roomName');
    const roomTypeId = queryParams.get('roomTypeId');
    const hotelId = queryParams.get('hotelId');
    const hotelName = queryParams.get('hotelName');
    const normalDayPrice = parseFloat(queryParams.get('price'));
    const navigate = useNavigate();

    const [orderDetails, setOrderDetails] = useState({
        hotelId: hotelId,
        checkInDate: '',
        checkOutDate: '',
        roomName: roomName,
        roomTypeId: roomTypeId,
        roomQuantity: 1,
        price: 0,
        paymentMethod: 'CD', // Default payment method
    });
    const [message, setMessage] = useState('');

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const calculateTotalPrice = (checkInDate, checkOutDate, roomQuantity, normalDayPrice) => {
        if (!checkInDate || !checkOutDate) {
            return 0;
        }
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDifference = checkOut - checkIn;
        const dayDifference = timeDifference / (1000 * 3600 * 24);
        return dayDifference * roomQuantity * normalDayPrice;
    };

    useEffect(() => {
        const totalPrice = calculateTotalPrice(orderDetails.checkInDate, orderDetails.checkOutDate, orderDetails.roomQuantity, normalDayPrice);
        setOrderDetails(prevDetails => ({
            ...prevDetails,
            price: totalPrice
        }));
    }, [orderDetails.checkInDate, orderDetails.checkOutDate, orderDetails.roomQuantity]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const paymentMethod = formData.get('paymentMethod');

        try {
            const response = await api.post('/orders/', {
                hotelId: hotelId,
                checkInDate: orderDetails.checkInDate,
                checkOutDate: orderDetails.checkOutDate,
                orderDetails: [{
                    roomTypeId: orderDetails.roomTypeId,
                    roomName: orderDetails.roomName,
                    roomQuantity: orderDetails.roomQuantity,
                    price: orderDetails.price,
                }],
                paymentMethod: paymentMethod
            });
            console.log(response.data);
            navigate('/order-success', { state: { ...response.data, hotelName: hotelName, orderDetails: [orderDetails] } });
        } catch (error) {
            console.error('Failed to create order', error);
            setMessage('Failed to create order');
        }
    };

    return (
        <div className="create-order-container">
            <h1>Create Order</h1>
            <p>Hotel Name: {hotelName}</p>
            <p>Room Type: {roomName}</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="checkInDate">Check-In Date</label>
                    <input
                        type="date"
                        id="checkInDate"
                        name="checkInDate"
                        value={orderDetails.checkInDate}
                        onChange={handleChange}
                        required
                        min={today}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="checkOutDate">Check-Out Date</label>
                    <input
                        type="date"
                        id="checkOutDate"
                        name="checkOutDate"
                        value={orderDetails.checkOutDate}
                        onChange={handleChange}
                        required
                        min={tomorrow}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="roomQuantity">Room Quantity</label>
                    <input
                        type="number"
                        id="roomQuantity"
                        name="roomQuantity"
                        value={orderDetails.roomQuantity}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <p>{orderDetails.price}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="paymentMethodDisplay">Payment Method</label>
                    <input
                        type="text"
                        id="paymentMethodDisplay"
                        value="Credit Card"
                        readOnly
                    />
                    <input
                        type="hidden"
                        id="paymentMethod"
                        name="paymentMethod"
                        value="CD"
                    />
                </div>
                <button type="submit" className="create-order-btn">Create Order</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateOrder;
