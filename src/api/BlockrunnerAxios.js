import axios from "axios";

const blockrunnerAxios = axios.create({
	baseURL: "http://localhost:8000",
});

export default blockrunnerAxios;
