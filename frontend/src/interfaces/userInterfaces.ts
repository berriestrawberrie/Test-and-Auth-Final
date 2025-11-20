export interface UserInterface extends UserCreationInterface {
  role: UserRoleType;
  id: string;
}

export interface UserCreationInterface {
  firstName: string;
  lastName: string;
  email: string;
  personNumber: string;
  phone: string;
  address: string;
}
export interface UserCreatingWithPasswordInterface extends UserCreationInterface {
  password: string;
}
export type UserRoleType = "STUDENT" | "ADMIN";
