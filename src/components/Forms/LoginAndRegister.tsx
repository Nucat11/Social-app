import React, { useContext } from "react";
import { LoginForm } from "./LoginForm/LoginForm";
import { RegisterForm } from "./RegisterForm/RegisterForm";
import { useState } from "react";

export const LoginAndRegister = () => {
  const [state, setState] = useState("register");
  if (state === "register") {
    return (
      <div>
        <RegisterForm />
        <button
          onClick={() => {
            if (state === "register") {
              setState("login");
            } else {
              setState("register");
            }
          }}
        >
          If you're already a user please sign in!
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <LoginForm />
        <button
          onClick={() => {
            if (state === "register") {
              setState("login");
            } else {
              setState("register");
            }
          }}
        >
          If you don't have an account please register.
        </button>
      </div>
    );
  }
};
