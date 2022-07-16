import axios from "axios";

const rundappAxios = axios.create({
	baseURL: process.env.REACT_APP_RUNDAPP_API_BASE_URL,
});

export default rundappAxios;
