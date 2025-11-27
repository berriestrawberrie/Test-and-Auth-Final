const verifyIdToken = jest.fn().mockImplementation(async (token: string) => {
  if (!token) throw new Error("No token provided");
  if (token === "mock-admin-token") return { uid: "adminAdminAdminAdminAdmin123", email: "admin@test.com" };
  if (token.startsWith("student-")) {
    const uid = token.replace(/^student-/, "");
    return { uid, email: `${uid}@test.local` };
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
