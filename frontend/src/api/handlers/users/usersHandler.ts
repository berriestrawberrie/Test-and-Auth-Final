import axios from "axios";

const BASE_URL = "http://localhost:1338/users"; // Or whatever url it will be.

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
    console.log("login frontend");
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
