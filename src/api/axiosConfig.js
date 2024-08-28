import axios from 'axios';

export default axios.create({
    // change to the ip of the backend
    // baseURL:'http://127.0.0.1:8080',
    baseURL:'http://charlotte3517.com:8080',
    headers: {"ngrok-skip-browser-warning": "true"}
});