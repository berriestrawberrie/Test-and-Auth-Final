import axios from "axios";
import type { UserCreationInterface } from "../../../interfaces/userInterfaces";

const BACKEND_PORT = "3000";
const BASE_URL = `http://localhost:${BACKEND_PORT}/users`;

export const getUsers = async () => {
  try {
    const response = await axios.get(BASE_URL);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export const loginUser = async (token: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/login`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const registerUser = async (userInfo: UserCreationInterface, token: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, userInfo, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
