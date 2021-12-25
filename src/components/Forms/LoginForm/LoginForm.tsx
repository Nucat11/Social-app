import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import { loginValidationSchema } from "../../../helpers/formSchemas";
import { auth, db } from "../../../../lib/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { MyInput } from "../../Input/MyInput";
import CustomButton from "../../CustomButton/CustomButton";

export const LoginForm: React.FC = () => {
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
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

        <div>
          <CustomButton type="submit" color="gray" width="150px" height="20px">Login</CustomButton>
        </div>
      </form>
    </div>
  );
};
