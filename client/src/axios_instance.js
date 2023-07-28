//create an axios instance to get start with and for getting base url of localhost

import axios from 'axios';
const baseURL = "http://localhost:5000/"
const axiosInstance = axios.create({
	baseURL: baseURL,
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json'
	}, 
});

export default axiosInstance