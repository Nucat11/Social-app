import styles from './LoginAndRegister.module.css'
import { LoginForm } from "../LoginForm/LoginForm";
import { RegisterForm } from "../RegisterForm/RegisterForm";
import { useState } from "react";
import CustomButton from "../../CustomButton/CustomButton";

export const LoginAndRegister = () => {
  const [state, setState] = useState("register");
  if (state === "register") {
    return (
      <div className={styles.container}>
        <p>It is free</p>
        <h1>Create an account</h1>
        <RegisterForm />
        <CustomButton
          onClick={() => {
            if (state === "register") {
              setState("login");
            } else {
              setState("register");
            }
          }}
          border="none"
          color="gray"
          height="20px"
          radius="3px"
          width="350px"
        >
          If you're already a user please sign in!
        </CustomButton>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Log in</h1>
        <LoginForm />

        <CustomButton
          onClick={() => {
            if (state === "register") {
              setState("login");
            } else {
              setState("register");
            }
          }}
          border="none"
          color="gray"
          height="20px"
          radius="3px"
          width="350px"
        >
          If you don't have an account please register.
        </CustomButton>
      </div>
    );
  }
};
