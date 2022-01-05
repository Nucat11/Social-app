import React, { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import { loginValidationSchema } from "../../../helpers/formSchemas";
import { auth } from "../../../../lib/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { MyInput } from "../../ReusableComponents/Input/MyInput";
import CustomButton from "../../ReusableComponents/CustomButton/CustomButton";
import { LoRContext } from "../../HomeContent/LoginOrRegisterContext/LoRContext";
import styles from "./LoginForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;

export const LoginForm: React.FC = () => {
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const { active, setActive } = useContext(LoRContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(loginValidationSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await signInWithEmailAndPassword(auth, data.emailLogin, data.passwordLogin)
      .then((userCred) => {
        const user = userCred.user;
        console.log(user);
        reset();
      })
      .catch((error) => {
        const errorCode: string = error.code;
        const errorMessage: string = error.message;
        console.log(errorMessage);
      });
  };

  return (
    <div className={styles.loginDiv}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <MyInput
          id="emailLogin"
          type="email"
          label="Email"
          error={errors.emailLogin}
          register={register}
          placeholder="example@domain.com"
        />
        <div className={styles.passwordLoginDiv}>
          <MyInput
            type={passwordShown ? "text" : "password"}
            id="passwordLogin"
            label="Password"
            error={errors.passwordLogin}
            register={register}
            placeholder="password123"
          />
          <i onClick={togglePasswordVisibility}>{eye}</i>
        </div>

        <div className={styles.buttonDiv}>
          <CustomButton
            type="submit"
            border="none"
            color="#111344a9"
            height="50px"
            radius="40px"
            width="40%"
          >
            Login
          </CustomButton>
          <p>OR</p>
          <CustomButton
            type="button"
            onClick={() => {
              setActive(!active);
            }}
            border="none"
            color="#52154e"
            height="50px"
            radius="40px"
            width="40%"
          >
            Register
          </CustomButton>
        </div>
      </form>
    </div>
  );
};
