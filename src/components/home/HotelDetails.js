import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const HotelDetails = () => {
    const { hotelName } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { hotelId } = location.state || {};
    const [hotelDetails, setHotelDetails] = useState(null);
    const [hotelOffers, setHotelOffers] = useState(null);
    const [orderDetails, setOrderDetails] = useState({
        checkInDate: "",
        checkOutDate: "",
        roomQuantity: 1,
        adults: 2,
    });
    const [selectedDates, setSelectedDates] = useState([null, null]);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [error, setError] = useState(null);
    const datePickerRef = useRef(null);

    useEffect(() => {
        const fetchHotelDetails = async () => {
            try {
                const response = await api.get(`/hotels/name/${encodeURIComponent(hotelName)}`);
                setHotelDetails(response.data);
            } catch (error) {
                setError("Failed to fetch hotel details. Limited information is displayed.");
                setHotelDetails({ hotel: { hotelName } });
            }
        };

        fetchHotelDetails();

        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setIsDatePickerOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [hotelName]);

    const fetchHotelOffers = async () => {
        if (!hotelId) {
            setError("Hotel ID is not available.");
            return;
        }

        try {
            const response = await api.get(`/amadeus/hotel-offers`, {
                params: {
                    hotelIds: hotelId,
                    checkInDate: orderDetails.checkInDate,
                    checkOutDate: orderDetails.checkOutDate,
                    adults: orderDetails.adults,
                    roomQuantity: orderDetails.roomQuantity,
                    paymentPolicy: "NONE",
                    bestRateOnly: true,
                },
            });
            setHotelOffers(response.data);
            navigate("/offer-details", { state: { offers: response.data, hotelName } });
        } catch (error) {
            setError("Failed to fetch hotel offers. Please try again later.");
        }
    };

    const handleDatesChange = (dates) => {
        const [start, end] = dates;

        const formatDate = (date) => {
            if (!date) return "";
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        setSelectedDates(dates);
        setOrderDetails((prevDetails) => ({
            ...prevDetails,
            checkInDate: start ? formatDate(start) : "",
            checkOutDate: end ? formatDate(end) : "",
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <span key={i} style={{ color: "#FFD700", marginRight: "2px" }}>★</span>
            );
        }
        return stars;
    };

    if (!hotelDetails) {
        return (
            <p style={{ textAlign: "center", fontSize: "18px", marginTop: "50px" }}>
                Loading hotel details...
            </p>
        );
    }

    const { hotel, reviews } = hotelDetails;

    return (
        <div
            style={{
                fontFamily: '"Poppins", Arial, sans-serif',
                backgroundColor: "#f8f9fa",
                minHeight: "100vh",
                padding: "20px",
            }}
        >
            {/* Hotel Name Section */}
            <div
                style={{
                    background: "linear-gradient(to bottom right, #FFD54F, #FFB74D)",
                    height: "300px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4A4A4A",
                    textShadow: "1px 1px 3px rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
            >
                <h1>{hotel.hotelName}</h1>
            </div>

            {error && (
                <p style={{ textAlign: "center", color: "red", marginBottom: "20px" }}>
                    {error}
                </p>
            )}

            {/* Conditionally Render Hotel Info */}
            {hotel.address && (
                <div
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        padding: "20px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        marginBottom: "20px",
                    }}
                >
                    <p style={{ margin: "10px 0" }}>
                        <strong>Address:</strong> {hotel.address}
                    </p>
                    <p style={{ margin: "10px 0" }}>
                        <strong>Rating:</strong> {hotel.rating} {renderStars(hotel.rating)}
                    </p>
                    <a
                        href={hotel.googleMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-block",
                            marginTop: "10px",
                            padding: "10px 20px",
                            backgroundColor: "#FFD54F",
                            color: "#fff",
                            textDecoration: "none",
                            fontWeight: "bold",
                            borderRadius: "5px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#FFC107")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#FFD54F")}
                    >
                        View on Google Maps
                    </a>
                </div>
            )}

            {/* Booking Section */}
            <div
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    marginBottom: "30px",
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Book a Room</h2>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        alignItems: "center",
                        gap: "20px",
                    }}
                >
                    <div ref={datePickerRef}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                        >
                            Check-In and Check-Out Dates:
                        </label>
                        <input
                            type="text"
                            value={
                                selectedDates[0] && selectedDates[1]
                                    ? `${selectedDates[0].toLocaleDateString()} - ${selectedDates[1].toLocaleDateString()}`
                                    : "Choose Date"
                            }
                            readOnly
                            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                            style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                textAlign: "center",
                                cursor: "pointer",
                            }}
                        />
                        {isDatePickerOpen && (
                            <DatePicker
                                selected={selectedDates[0]}
                                onChange={handleDatesChange}
                                startDate={selectedDates[0]}
                                endDate={selectedDates[1]}
                                selectsRange
                                minDate={new Date()}
                                inline
                            />
                        )}
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Number of Adults:</label>
                        <input
                            type="number"
                            name="adults"
                            value={orderDetails.adults}
                            onChange={handleInputChange}
                            min="1"
                            style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Room Quantity:</label>
                        <input
                            type="number"
                            name="roomQuantity"
                            value={orderDetails.roomQuantity}
                            onChange={handleInputChange}
                            min="1"
                            style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                            }}
                        />
                    </div>
                </div>
                <button
                    onClick={fetchHotelOffers}
                    style={{
                        display: "block",
                        margin: "20px auto 0",
                        padding: "10px 20px",
                        backgroundColor: "#007BFF",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "16px",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#007BFF")}
                >
                    Search Offers
                </button>
            </div>

            {/* Conditionally Render Reviews */}
            {reviews && reviews.length > 0 && (
                <div>
                    <h2 style={{ marginTop: "40px", textAlign: "center" }}>Reviews</h2>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "20px",
                        }}
                    >
                        {reviews.map((review, index) => (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: "#fff",
                                    padding: "15px",
                                    borderRadius: "10px",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    lineHeight: "1.6",
                                }}
                            >
                                <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
                                    {review.authorName} ({review.reviewTime}):
                                </p>
                                <p style={{ marginBottom: "10px" }}>
                                    Rating: {review.rating} {renderStars(review.rating)}
                                </p>
                                <p>{review.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HotelDetails;
