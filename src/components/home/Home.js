import React, { useState } from 'react';
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Home = ({ hotels }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const navigate = useNavigate();

  const getReviewsByPlaceId = async (placeId) => {
    console.log(`Fetching reviews for placeId: ${placeId}`); // Debug log
    try {
      const response = await api.get(`/hotels/reviews/${placeId}`);
      console.log(response.data);
      setReviews(response.data || []); // 确保数据被正确设置
    } catch (error) {
      console.error(`Failed to fetch reviews for placeId: ${placeId}`, error); // Debug log
    }
  };

  const getRoomTypes = async () => {
    try {
      const response = await api.get(`/hotels/roomtypes`);
      console.log(response.data);
      setRoomTypes(response.data || []); // 确保数据被正确设置
    } catch (error) {
      console.error(`Failed to fetch room types`, error); // Debug log
    }
  };

  const searchHotelByName = async () => {
    try {
      const response = await api.get(`/hotels/name/${searchTerm}`);
      console.log(response.data);
      const singleHotel = response.data;
      setSearchResult(singleHotel); // 设置搜索结果
      console.log(`Found placeId: ${singleHotel.placeId}`);
      if (singleHotel.placeId) {
        await getReviewsByPlaceId(singleHotel.placeId); // 根据placeId获取评论
        await getRoomTypes(); // 获取房型数据
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBookRoom = (roomType) => {
    console.log(`Navigating to create order with roomTypeId: ${roomType.roomTypeId}`); // Debug log
    navigate(`/create-order?roomTypeId=${roomType.roomTypeId}&hotelId=${searchResult.hotelId}&hotelName=${searchResult.hotelName}&roomName=${roomType.roomName}&price=${roomType.normalDayPrice}`);
  };


  return (
      <div>
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter hotel name"
            style={{ marginRight: '10px' }}
        />
        <button onClick={searchHotelByName}>Search</button>
        {searchResult && (
            <div className="search-result">
              <h2>{searchResult.hotelName}</h2>
              <p dangerouslySetInnerHTML={{ __html: searchResult.googleMapUrl }}></p>
              <h3>Reviews:</h3>
              <ul>
                {Array.isArray(reviews) && reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <li key={index}>
                          <p><strong>{review.authorName}</strong>: {review.content}</p>
                          <p>Rating: {review.rating}</p>
                          <span>Review Time: {review.reviewTime}</span>
                        </li>
                    ))
                ) : (
                    <li>No reviews available</li>
                )}
              </ul>
              <h3>Room Types:</h3>
              <ul>
                {Array.isArray(roomTypes) && roomTypes.length > 0 ? (
                    roomTypes.map((roomType) => (
                        <li key={roomType.roomTypeId}>
                          <p><strong>{roomType.roomName}</strong></p>
                          <p>Min People: {roomType.minPeople}</p>
                          <p>Max People: {roomType.maxPeople}</p>
                          <p>Price: {roomType.normalDayPrice}</p>
                          <p>Private Bath: {roomType.privateBath ? 'Yes' : 'No'}</p>
                          <p>Wifi: {roomType.wifi ? 'Yes' : 'No'}</p>
                          <p>Breakfast: {roomType.breakfast ? 'Yes' : 'No'}</p>
                          <p>Mini Bar: {roomType.miniBar ? 'Yes' : 'No'}</p>
                          <p>Room Service: {roomType.roomService ? 'Yes' : 'No'}</p>
                          <p>Television: {roomType.television ? 'Yes' : 'No'}</p>
                          <p>Air Conditioner: {roomType.airConditioner ? 'Yes' : 'No'}</p>
                          <p>Refrigerator: {roomType.refrigerator ? 'Yes' : 'No'}</p>
                          <p>Smoke Free: {roomType.smokeFree ? 'Yes' : 'No'}</p>
                          <p>Child Friendly: {roomType.childFriendly ? 'Yes' : 'No'}</p>
                          <p>Pet Friendly: {roomType.petFriendly ? 'Yes' : 'No'}</p>
                          <button onClick={() => handleBookRoom(roomType)}>Book</button>
                        </li>
                    ))
                ) : (
                    <li>No room types available</li>
                )}
              </ul>
            </div>
        )}
      </div>
  );
};

export default Home;
