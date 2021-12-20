import { Path, UseFormRegister } from "react-hook-form";
import styles from "./Input.module.css";

interface Props {
  error: any;
  type: string;
  label: string;
  id: Path<Inputs>;
  register: UseFormRegister<Inputs>;
  placeholder?: string;
}
export const MyInput = ({ error, label, id, register, placeholder, type }: Props) => {
  return (
    <div className={styles.field}>
      <input
      
        id={id}
        type={type}
        {...register(id)}
        placeholder={placeholder}
        className={styles.input}
      ></input>
      <label htmlFor={id}>{label}</label>
      {error && <div>{error.message}</div>}
    </div>
  );
};
