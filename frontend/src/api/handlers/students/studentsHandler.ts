import axios from "axios";
import { getCurrentUserToken } from "../../auth/token";
import { userIdSchema } from "../../../schemas/usersSchema";
const BACKEND_PORT = "3000";
const BASE_URL = `http://localhost:${BACKEND_PORT}/students`;

export const getStudentData = async (id: string) => {
  try {
    const validatedId = userIdSchema.safeParse(id);
    if (!validatedId.success) throw validatedId.error;

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
