import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

const OfferDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { offers, hotelName } = location.state || {};

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        cardNumber: "",
        expiryDate: "",
        holderName: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleBook = async () => {
        try {
            if (!offers || !offers.data || !offers.data[0] || !offers.data[0].offers[0]) {
                alert("Offers data is missing. Please try again.");
                return;
            }

            const offerId = offers.data[0].offers[0].id;

            const requestBody = {
                offerId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                email: formData.email,
                cardNumber: formData.cardNumber,
                expiryDate: formData.expiryDate,
                holderName: formData.holderName,
            };

            const response = await api.post(`/amadeus/book-hotel`, requestBody);
            alert("Booking successful!");
            navigate("/");
        } catch (error) {
            alert("Failed to book the hotel. Please try again.");
        }
    };

    if (!offers) {
        return <p>No offers available.</p>;
    }

    if (!offers.data || offers.data.length === 0) {
        return <p>No data available in offers.</p>;
    }

    const offer = offers.data[0].offers[0];
    const hotel = offers.data[0].hotel;

    return (
        <div
            style={{
                fontFamily: '"Poppins", Arial, sans-serif',
                padding: "20px",
                backgroundColor: "#f8f9fa",
                minHeight: "100vh",
                textAlign: "center",
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    margin: "20px auto",
                    maxWidth: "600px",
                    padding: "30px",
                }}
            >
                <h1 style={{ color: "#333", fontSize: "28px", marginBottom: "10px" }}>
                    {hotel.name}
                </h1>
                <p style={{ fontSize: "16px", marginBottom: "20px", color: "#666" }}>
                    Please fill in the details below to complete your booking.
                </p>
                <div
                    style={{
                        backgroundColor: "#f1f1f1",
                        borderRadius: "8px",
                        padding: "15px",
                        textAlign: "left",
                        marginBottom: "20px",
                    }}
                >
                    <p><strong>Room Type:</strong> {offer.room.typeEstimated.category}</p>
                    <p><strong>Total Price:</strong> {offer.price.currency} {offer.price.total}</p>
                    <p><strong>Check-in Date:</strong> {offer.checkInDate}</p>
                    <p><strong>Check-out Date:</strong> {offer.checkOutDate}</p>
                    <p><strong>Room Quantity:</strong> {offer.roomQuantity}</p>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleBook();
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
                        <label style={{ fontWeight: "bold", color: "#333" }}>
                            First Name:
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginTop: "5px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                }}
                            />
                        </label>
                        <label style={{ fontWeight: "bold", color: "#333" }}>
                            Last Name:
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginTop: "5px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                }}
                            />
                        </label>
                        <label style={{ fontWeight: "bold", color: "#333" }}>
                            Phone:
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginTop: "5px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                }}
                            />
                        </label>
                        <label style={{ fontWeight: "bold", color: "#333" }}>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginTop: "5px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                }}
                            />
                        </label>
                        <label style={{ fontWeight: "bold", color: "#333" }}>
                            Credit Card Number:
                            <input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginTop: "5px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                }}
                            />
                        </label>
                        <label style={{ fontWeight: "bold", color: "#333" }}>
                            Credit Card Expiry Date:
                            <input
                                type="text"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginTop: "5px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                }}
                            />
                        </label>
                        <label style={{ fontWeight: "bold", color: "#333" }}>
                            Card Holder Name:
                            <input
                                type="text"
                                name="holderName"
                                value={formData.holderName}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginTop: "5px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                }}
                            />
                        </label>
                    </div>
                    <button
                        type="submit"
                        style={{
                            backgroundColor: "#007BFF",
                            color: "#fff",
                            padding: "12px 20px",
                            fontSize: "16px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginTop: "20px",
                            transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#007BFF")}
                    >
                        Book
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OfferDetails;
