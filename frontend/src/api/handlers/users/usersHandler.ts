import axios from "axios";

const BASE_URL = "http://localhost:1338/users"; // Or whatever url it will be.

export const getUsers = async () => {
    try {
        const response = await axios.get(BASE_URL);

        const result = response.data;

        return result;
    } catch (error) {
        console.error(error);
    }
};
