import styles from "./LoginAndRegister.module.css";
import { LoginForm } from "../LoginForm/LoginForm";
import { RegisterForm } from "../RegisterForm/RegisterForm";
import { useContext } from "react";
import CustomButton from "../../ReusableComponents/CustomButton/CustomButton";
import React from "react";
import { LoRContext } from "../../LoginOrRegisterContext/LoRContext";

export const LoginAndRegister = () => {
  const { active } = useContext(LoRContext);
  if (active === true) {
    return (
      <div className={styles.container}>
        <p>It is free</p>
        <h1>
          Create an account<span>.</span>
        </h1>
        <RegisterForm />
      </div>
    );
  } else {
    return (
      <div className={styles.container}
      ><p>If you are already a user</p>
        <h1>Log in<span>.</span></h1>
        <LoginForm />
      </div>
    );
  }
};
