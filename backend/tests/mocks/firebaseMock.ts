const verifyIdToken = jest.fn().mockResolvedValue({
  uid: "adminAdminAdminAdminAdmin123",
  email: "admin@test.com",
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
