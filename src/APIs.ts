import axios from "axios";

export interface UserForRegistration {
  username: string;
  email: string;
  password: string;
}

export interface User {
  username: string;
  bio: string | null;
  image: string | null;
  email: string;
  token: string;
}
export type GenericErrors = Record<string, string[]>;

export async function signUp(
  user: UserForRegistration,
): Promise<Pick<User, "token"> | GenericErrors> {
  const mappedUser = {
    name: user.username,
    email: user.email,
    password: user.password,
    password_confirmation: user.password,
    institute_id: 1,
    phone: "987",
  };
  return axios.post("register", { mappedUser });
}
