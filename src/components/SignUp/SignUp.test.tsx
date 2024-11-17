import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import SignUp from "./";
import { handlers } from "./handlers";
import { debug } from "jest-preview";
import {
  TO_REGISTER_USER,
  TO_REGISTER_USER_INVALID_PASSWORD,
} from "./constants";
import userEvent from "@testing-library/user-event";

// Setting up the mock server
const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const getters = {
  getEmailInput: () => screen.getByLabelText(/^Email Address/),
  getPasswordInput: () => screen.getByLabelText(/^Password/),
  getUserNameInput: () => screen.getByLabelText(/^User Name/),
  getSignUpButton: () =>
    screen.getByRole("button", {
      name: /Sign Up/,
    }),
};

export const signUpUser = async () => {
  const emailInput = getters.getEmailInput();
  const passwordInput = getters.getPasswordInput();
  const signUpButton = getters.getSignUpButton();
  const userNameInput = getters.getUserNameInput();
  await React.act(async () => {
    userEvent.type(userNameInput, TO_REGISTER_USER.username);
    userEvent.type(emailInput, TO_REGISTER_USER.email);
    userEvent.type(passwordInput, TO_REGISTER_USER.password);

    expect(userNameInput).toHaveValue(TO_REGISTER_USER.username);
    expect(emailInput).toHaveValue(TO_REGISTER_USER.email);
    expect(passwordInput).toHaveValue(TO_REGISTER_USER.password);

    userEvent.click(signUpButton);
  });
};
describe("SignUp Component", () => {
  describe("Validation", () => {
    it("should display validation errors for invalid email", async () => {
      render(<SignUp />);
      const emailInput = getters.getEmailInput();
      userEvent.type(emailInput, "test");
      userEvent.click(document.body);
      const message = await screen.findByText("Enter a valid email");
      expect(message).toBeInTheDocument();

      // use jest preview to debug your test
      debug();
    });

    it("should display validation errors for short password", async () => {
      render(<SignUp />);
      const passwordInput = getters.getPasswordInput();
      userEvent.type(passwordInput, "123");
      userEvent.click(document.body);
      const message = await screen.findByText(
        "Password should be of minimum 8 characters length",
      );
      expect(message).toBeInTheDocument();
    });

    it("should display success message on successful sign-up", async () => {
      render(<SignUp />);
      await signUpUser();
      await waitFor(() =>
        expect(screen.getByText("Sign Up Successfully!")).toBeInTheDocument(),
      );
    });

    it("should display error message on sign-up failure", async () => {
      render(<SignUp />);
      await signUpUser();
      await waitFor(() =>
        expect(screen.getByText(/Error Signing Up!/)).toBeInTheDocument(),
      );
    });
  });

  describe("Form Interaction", () => {
    afterEach(() => jest.resetAllMocks());
    it("should enable Sign Up button when form is valid", async () => {
      render(<SignUp />);
      const userNameInput = getters.getUserNameInput();
      const emailInput = getters.getEmailInput();
      const passwordInput = getters.getPasswordInput();
      const signUpButton = getters.getSignUpButton();
      await React.act(async () => {
        await userEvent.type(userNameInput, TO_REGISTER_USER.username);
        await userEvent.type(emailInput, TO_REGISTER_USER.email);
        await userEvent.type(passwordInput, TO_REGISTER_USER.password);
        expect(signUpButton).toBeEnabled();
      });
    });

    it("should disable Sign Up button when form is invalid", async () => {
      render(<SignUp />);

      const userNameInput = getters.getUserNameInput();
      const emailInput = getters.getEmailInput();
      const passwordInput = getters.getPasswordInput();
      const signUpButton = getters.getSignUpButton();
      await React.act(async () => {
        await userEvent.type(
          userNameInput,
          TO_REGISTER_USER_INVALID_PASSWORD.username,
        );
        await userEvent.type(
          emailInput,
          TO_REGISTER_USER_INVALID_PASSWORD.email,
        );
        await userEvent.type(
          passwordInput,
          TO_REGISTER_USER_INVALID_PASSWORD.password,
        );
        expect(signUpButton).toBeDisabled();
      });
    });

    it("should update form fields on user input", async () => {
      render(<SignUp />);
      const userNameInput = getters.getUserNameInput();
      const emailInput = getters.getEmailInput();
      const passwordInput = getters.getPasswordInput();
      await React.act(async () => {
        await userEvent.type(userNameInput, TO_REGISTER_USER.username);
        await userEvent.type(emailInput, TO_REGISTER_USER.email);
        await userEvent.type(passwordInput, TO_REGISTER_USER.password);
        expect(userNameInput).toHaveValue(TO_REGISTER_USER.username);
        expect(emailInput).toHaveValue(TO_REGISTER_USER.email);
        expect(passwordInput).toHaveValue(TO_REGISTER_USER.password);
      });
    });

    it("should redirect user to home page after successful signup", async () => {
      render(<SignUp />);
      await signUpUser();
      await waitFor(() =>
        expect(screen.getByText(/^pricing/i)).toBeInTheDocument(),
      );
    });
  });
});
