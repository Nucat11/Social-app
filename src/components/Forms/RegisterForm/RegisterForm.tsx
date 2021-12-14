import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { validationSchema } from "../../../helpers/formSchemas";
import { auth, db } from "../../../pages/api/firebase/firebase";
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
    date: string,
    terms: boolean
  ) {
    set(ref(db, "users/" + userId), {
      fullname,
      email,
      date,
      terms,
    });
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserSubmitForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<UserSubmitForm> = async (data) => {
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((cred) => {
        writeUserData(
          cred.user.uid,
          data.fullname,
          data.email,
          JSON.stringify(data.date),
          data.acceptTerms
        )
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
        <div>
          <label>Full Name</label>
          <input type="text" {...register("fullname")} />
          <div>{errors.fullname?.message}</div>
        </div>

        <div>
          <label>Email</label>
          <input type="text" {...register("email")} />
          <div>{errors.email?.message}</div>
        </div>

        <div>
          <label>Password</label>
          <input type="password" {...register("password")} />
          <div>{errors.password?.message}</div>
        </div>

        <div>
          <label>Date of birth</label>
          <input type="date" {...register("date")} />
          <div>{errors.date?.message}</div>
        </div>

        <div>
          <input type="checkbox" {...register("acceptTerms")} />
          <label htmlFor="acceptTerms">
            I have read and agree to the Terms
          </label>
          <div></div>
        </div>

        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};
