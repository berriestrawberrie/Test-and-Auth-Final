export interface UserInterface {
  firstName: string;
  lastName: string;
  email: string;
  personNumber: number;
  telephone: number;
  address: string;
  role: UserRoleType;
}
export type UserRoleType = "STUDENT" | "ADMIN";
