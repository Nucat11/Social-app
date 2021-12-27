import { ReactChild } from "react";
import { FieldErrors, Path, UseFormRegister } from "react-hook-form";
import styles from "./Input.module.css";

interface Props {
  children?: ReactChild;
  error: FieldErrors | undefined;
  type: string;
  label: string;
  id: Path<Inputs>;
  register: UseFormRegister<Inputs>;
  placeholder?: string;
}
export const MyInput = ({
  error,
  label,
  id,
  register,
  placeholder,
  type,
  children
}: Props) => {
  return (
    <div className={styles.field}>
      {error && <div className={styles.error}>{error.message}</div>}
      <input
        id={id}
        type={type}
        {...register(id)}
        placeholder={placeholder}
        className={styles.input}
      ></input>
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
};
