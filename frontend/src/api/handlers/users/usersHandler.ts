import axios from "axios";

const BACKEND_PORT = "3000";
const BASE_URL = `http://localhost:${BACKEND_PORT}/users`;

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
