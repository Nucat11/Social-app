import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import { validationSchema } from "../../../helpers/formSchemas";
import { auth, db } from "../../../../lib/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { MyInput } from "../../Input/MyInput";
import styles from "./RegisterForm.module.css";

export const RegisterForm: React.FC = () => {
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
    <div>
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

        <MyInput
          id="passwordLogin"
          type="password"
          label="Password"
          error={errors.passwordLogin}
          register={register}
          placeholder="password123"
        />

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

        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};
