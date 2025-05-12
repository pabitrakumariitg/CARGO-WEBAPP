import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://cargo-backend-theta.vercel.app/api",
  withCredentials: true,
});
