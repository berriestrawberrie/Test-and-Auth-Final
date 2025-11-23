import axios from "axios";
import type { UserCreatingWithPasswordInterface } from "../../../interfaces/userInterfaces";
import { userCreationSchema } from "../../../schemas/usersSchema";
import { getCurrentUserToken } from "../../auth/token";

const BACKEND_PORT = "3000";
const BASE_URL = `http://localhost:${BACKEND_PORT}/admins`;

export const getStudents = async () => {
  try {
    const token = await getCurrentUserToken();
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

export const registerStudent = async (userInfo: UserCreatingWithPasswordInterface) => {
  try {
    const validatedUserInfo = userCreationSchema.safeParse(userInfo);
    if (!validatedUserInfo.success) throw validatedUserInfo.error;

    const token = await getCurrentUserToken();
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
