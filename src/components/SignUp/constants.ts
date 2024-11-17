import * as yup from "yup";
import { User, UserForRegistration } from "../../APIs";

export const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const TO_REGISTER_USER: UserForRegistration = {
  username: "test",
  email: "ANDtesXYZt@gmail.com",
  password: "321321321",
};

const TO_REGISTER_USER_INVALID_PASSWORD: UserForRegistration = {
  username: "test",
  email: "ANDtesXYZt@gmail.com",
  password: "321321321",
};

const REGISTERED_USER: Pick<User, "username" | "email" | "token"> = {
  username: "test",
  email: "ANDtest@gmail.com",
  token: "test1234",
};
export { TO_REGISTER_USER, TO_REGISTER_USER_INVALID_PASSWORD, REGISTERED_USER };
