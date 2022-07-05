import axios from "axios";

const blockrunnerInstance = axios.create({
	baseURL: "http:localhost:8000",
});

export default blockrunnerInstance;
