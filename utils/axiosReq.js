import axios from 'axios';

const baseURL = window.location.hostname === 'localhost'
  ? "http://localhost:5000/"
  : "https://car-advertisement-server.vercel.app/";

const apiReq = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

export default apiReq;
