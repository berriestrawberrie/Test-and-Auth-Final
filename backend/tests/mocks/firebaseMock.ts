import { mockAdminToken, TEST_ADMIN_ID } from "../helpers";

const verifyIdToken = jest.fn().mockImplementation(async (token: string) => {
  if (!token) throw new Error("No token provided");

  if (token === mockAdminToken) {
    return { uid: TEST_ADMIN_ID, email: "admin@test.com" };
  }
  if (token.startsWith("student-")) {
    return { uid: token.replace(/^student-/, ""), email: "student@test.com" };
  }
  throw new Error("Invalid token");
});

const createUser = jest.fn().mockResolvedValue({ uid: "new-student-uid" });
const deleteUser = jest.fn().mockResolvedValue(undefined);
const updateUser = jest.fn().mockResolvedValue(undefined);

jest.mock("firebase-admin", () => ({
  auth: jest.fn().mockReturnValue({
    verifyIdToken,
    createUser,
    deleteUser,
    updateUser,
  }),
  initializeApp: jest.fn(),
}));

export const authMocks = { verifyIdToken, createUser, deleteUser, updateUser };
