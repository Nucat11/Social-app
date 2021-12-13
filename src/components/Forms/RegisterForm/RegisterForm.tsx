import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import * as Yup from "yup";
import { validationSchema } from "../../../helpers/formSchemas";
import { IconButton } from "@mui/material";
import { app, auth, db } from "../../../pages/api/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

interface UserSubmitForm {
  fullname: string;
  email: string;
  password: string;
  date: Date;
  acceptTerms: boolean;
}

export const RegisterForm: React.FC = () => {
  function writeUserData(
    userId: string,
    fullname: string,
    email: string,
    date: Date,
    terms: boolean
  ) {
    set(ref(db, "users/" + userId), {
      fullname: fullname,
      email: email,

      date: date,
      terms: terms,
    });
  }

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword((prevValue) => !prevValue);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserSubmitForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: UserSubmitForm) => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((cred) => {
        writeUserData(
          cred.user.uid,
          data.fullname,
          data.email,
          data.date,
          data.acceptTerms
        );
        reset();
        console.log(cred);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="fullname">Full Name</label>
          <input type="text" {...register("fullname")} />
          <div>{errors.fullname?.message}</div>
        </div>

        <div>
          <label>Email</label>
          <input type="text" {...register("email")} id="email" />
          <div>{errors.email?.message}</div>
        </div>

        <div>
          <label>Password</label>
          <input type="password" {...register("password")} id="password" />
          <div>{errors.password?.message}</div>
        </div>

        <div>
          <label>Date of birth</label>
          <input type="date" {...register("date")} id="date" />
          <div>{errors.date?.message}</div>
        </div>

        <div>
          <input type="checkbox" {...register("acceptTerms")} id="checkbox" />
          <label htmlFor="acceptTerms">
            I have read and agree to the Terms
          </label>
          <div></div>
        </div>

        <div>
          <button type="submit">Register</button>
          <button type="button" onClick={() => reset()}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};
