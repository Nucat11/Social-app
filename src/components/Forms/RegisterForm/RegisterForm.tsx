import React, { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import { validationSchema } from "../../../helpers/formSchemas";
import { auth, db } from "../../../../lib/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { MyInput } from "../../Input/MyInput";
import styles from "./RegisterForm.module.css";
import CustomButton from "../../CustomButton/CustomButton";
import { LoRContext } from "../../LoginOrRegisterContext/LoRContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;

export const RegisterForm: React.FC = () => {
  const { active, setActive } = useContext(LoRContext);
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  function writeUserData(
    userId: string,
    fullname: string,
    email: string,
    date: string,
    terms: boolean,
    posts: Array<object>
  ) {
    set(ref(db, "users/" + userId), {
      fullname,
      email,
      date,
      terms,
      posts,
    });
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await createUserWithEmailAndPassword(
      auth,
      data.emailLogin,
      data.passwordLogin
    )
      .then((cred) => {
        writeUserData(
          cred.user.uid,
          data.fullname,
          data.emailLogin,
          JSON.stringify(data.date),
          data.acceptTerms,
          []
        );
        reset();
        const user = cred.user;
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className={styles.registerDiv}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <MyInput
          id="fullname"
          type="text"
          label="Full Name"
          error={errors.fullname}
          register={register}
          placeholder="John Doe"
        />

        <MyInput
          id="emailLogin"
          type="email"
          label="Email"
          error={errors.emailLogin}
          register={register}
          placeholder="example@domain.com"
        />

        <div className={styles.passwordDiv}>
          <MyInput
            id="passwordLogin"
            type={passwordShown ? "text" : "password"}
            label="Password"
            error={errors.passwordLogin}
            register={register}
            placeholder="password123"
          />
          <i onClick={togglePasswordVisibility}>{eye}</i>
        </div>

        <MyInput
          id="date"
          type="date"
          label="Date of birth"
          error={errors.date}
          register={register}
        />

        <MyInput
          id="acceptTerms"
          type="checkbox"
          label="Accept terms"
          error={errors.acceptTerms}
          register={register}
        />

        <div className={styles.buttonDiv}>
          <CustomButton
            type="submit"
            border="none"
            color="#111344a9"
            height="50px"
            radius="40px"
            width="40%"
          >
            Register
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
            Sign in
          </CustomButton>
        </div>
      </form>
    </div>
  );
};
