import { auth } from "../../firebase/firebase.init";

export const getCurrentUserToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No authenticated user");
  }
  const token = await user.getIdToken();
  return token;
};
