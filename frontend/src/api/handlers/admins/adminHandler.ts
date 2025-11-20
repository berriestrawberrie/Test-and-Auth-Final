import axios from "axios";
import type { UserCreatingWithPasswordInterface } from "../../../interfaces/userInterfaces";
import { userCreationSchema } from "../../../schemas/usersSchema";

const BACKEND_PORT = "3000";
const BASE_URL = `http://localhost:${BACKEND_PORT}/admins`;

export const getStudents = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/students`, {
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

export const registerStudent = async (userInfo: UserCreatingWithPasswordInterface, token: string) => {
  try {
    const validatedUserInfo = userCreationSchema.safeParse(userInfo);
    if (!validatedUserInfo.success) throw validatedUserInfo.error;

    const response = await axios.post(`${BASE_URL}/register`, validatedUserInfo.data, {
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
