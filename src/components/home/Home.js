import React, { useState } from "react";
import api from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [city, setCity] = useState("");
    const [radius, setRadius] = useState("");
    const [hotels, setHotels] = useState([]);
    const navigate = useNavigate();

    const cities = [
        { code: "TPE", name: "Taipei" },
        { code: "KHH", name: "Kaohsiung" },
        { code: "TNN", name: "Tainan" },
    ];

    const getHotelsByCity = async () => {
        if (!city || !radius) {
            alert("Please select a city and enter a distance");
            return;
        }

        try {
            const response = await api.get("/amadeus/hotels-by-city", {
                params: {
                    cityCode: city,
                    radius: radius,
                },
            });
            setHotels(response.data.data || []);
        } catch (error) {
            alert("Unable to fetch hotel data. Please try again later.");
            setHotels([]);
        }
    };

    const handleHotelClick = (hotelName, hotelId) => {
        navigate(`/hotel-details/${encodeURIComponent(hotelName)}`, {
            state: { hotelId },
        });
    };

    return (
        <div
            style={{
                padding: "20px",
                fontFamily: "Arial, sans-serif",
                backgroundColor: "#f5f5f5",
                minHeight: "100vh",
            }}
        >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
                    Hotel Search
                </h1>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "20px",
                        marginBottom: "20px",
                        backgroundColor: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <label style={{ fontSize: "16px" }}>
                        Select City:
                        <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            style={{
                                marginLeft: "10px",
                                padding: "5px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}
                        >
                            <option value="">--Select City--</option>
                            {cities.map((city) => (
                                <option key={city.code} value={city.code}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label style={{ fontSize: "16px" }}>
                        Distance (km):
                        <input
                            type="number"
                            value={radius}
                            onChange={(e) => setRadius(e.target.value)}
                            style={{
                                marginLeft: "10px",
                                padding: "5px",
                                width: "80px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}
                        />
                    </label>
                    <button
                        onClick={getHotelsByCity}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "16px",
                        }}
                    >
                        Search Hotels
                    </button>
                </div>

                <div>
                    <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                        Hotel List
                    </h2>
                    {hotels.length > 0 ? (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(300px, 1fr))",
                                gap: "20px",
                            }}
                        >
                            {hotels.map((hotel) => (
                                <div
                                    key={hotel.hotelId}
                                    style={{
                                        backgroundColor: "#fff",
                                        borderRadius: "8px",
                                        padding: "20px",
                                        boxShadow:
                                            "0 4px 8px rgba(0, 0, 0, 0.1)",
                                        cursor: "pointer",
                                    }}
                                    onClick={() =>
                                        handleHotelClick(hotel.name, hotel.hotelId)
                                    }
                                >
                                    <h3
                                        style={{
                                            fontSize: "18px",
                                            color: "#333",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        {hotel.name}
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: "14px",
                                            color: "#555",
                                            margin: "0",
                                        }}
                                    >
                                        Distance:{" "}
                                        {hotel.distance?.value || "Unknown"} km
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p
                            style={{
                                textAlign: "center",
                                color: "#777",
                            }}
                        >
                            No hotels found. Please adjust your search criteria.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
