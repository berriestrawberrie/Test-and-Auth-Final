import type { GradeInterface } from "./gradeInterfaces";

export interface BaseUserInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  personNumber: string;
  phone: string;
  address: string;
}

export interface StudentInterface extends BaseUserInterface {
  role: "STUDENT";
  grades: GradeInterface[];
}

export interface AdminInterface extends BaseUserInterface {
  role: "ADMIN";
}

export type UserInterface = StudentInterface | AdminInterface;

export const isStudent = (user: UserInterface): user is StudentInterface => {
  return user.role === "STUDENT";
};

export const isAdmin = (user: UserInterface): user is AdminInterface => {
  return user.role === "ADMIN";
};
export interface UserCreationInterface {
  firstName: string;
  lastName: string;
  email: string;
  personNumber: string;
  phone: string;
  address: string;
}
export interface UserCreationWithPasswordInterface extends UserCreationInterface {
  password: string;
}
export interface LoggedInUserInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoleType;
}

export type UserRoleType = "STUDENT" | "ADMIN";
