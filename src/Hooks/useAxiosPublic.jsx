import axios from "axios";
import API_BASE_URL from "../config/apiBase";

const axiosPublic = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;