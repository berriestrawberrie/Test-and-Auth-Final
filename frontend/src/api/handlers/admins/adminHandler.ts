import axios from "axios";
import type { StudentInterface, UserCreationWithPasswordInterface } from "../../../interfaces/userInterfaces";
import { userCreationSchema } from "../../../schemas/usersSchema";
import { getCurrentUserToken } from "../../auth/token";

const BACKEND_PORT = "3000";
const BASE_URL = `http://localhost:${BACKEND_PORT}/admins`;

export const getStudents = async (): Promise<{ message: string; data: StudentInterface[] } | undefined> => {
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

export const registerStudent = async (userInfo: UserCreationWithPasswordInterface) => {
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

export const deleteStudent = async (id: string) => {
  try {
    const token = await getCurrentUserToken();
    const response = await axios.delete(`${BASE_URL}/students/${id}`, {
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
