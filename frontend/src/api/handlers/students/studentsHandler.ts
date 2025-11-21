import axios from "axios";
const BACKEND_PORT = "3000";
const BASE_URL = `http://localhost:${BACKEND_PORT}/students`;

export const getStudentData = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: unknown) {
    console.error("Failed to fetch student data: ", error);
  }
};
