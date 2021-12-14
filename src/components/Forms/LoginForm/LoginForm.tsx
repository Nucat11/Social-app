import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { loginValidationSchema } from "../../../helpers/formSchemas";
import { auth, db } from "../../../pages/api/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";


interface UserLoginSubmitForm {
  emailLogin: string;
  passwordLogin: string;
}

export const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserLoginSubmitForm>({
    resolver: yupResolver(loginValidationSchema),
  });

  const onSubmit: SubmitHandler<UserLoginSubmitForm> = async (data) => {
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
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label>Email</label>
          <input type="text" {...register("emailLogin")} />
          <div>{errors.emailLogin?.message}</div>
        </div>

        <div>
          <label>Password</label>
          <input type="password" {...register("passwordLogin")} />
          <div>{errors.passwordLogin?.message}</div>
        </div>

        <div>
          <button type="submit">Login</button>

        </div>
      </form>
    </div>
  );
};
