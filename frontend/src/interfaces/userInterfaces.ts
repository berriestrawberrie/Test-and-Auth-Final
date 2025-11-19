export interface UserInterface extends UserCreationInterface {
  id: string;
  role: UserRoleType;
}

export interface UserCreationInterface {
  firstName: string;
  lastName: string;
  email: string;
  personNumber: string;
  phone: string;
  address: string;
}
export type UserRoleType = "STUDENT" | "ADMIN";
