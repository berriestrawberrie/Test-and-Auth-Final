import axios from "axios";
import { getCurrentUserToken } from "../../auth/token";
const BACKEND_PORT = "3000";
const BASE_URL = `http://localhost:${BACKEND_PORT}/students`;

export const getStudentData = async (id: string) => {
  try {
    const token = await getCurrentUserToken();
    const response = await axios.get(`${BASE_URL}/${id}`, {
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
