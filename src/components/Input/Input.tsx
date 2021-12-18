import React from "react";
import styles from "./input.module.css";

interface Props {
  error: any;
  type: string;
  label: string;
  id: string;
}

export const Input = ({ error, label, id, ...inputProps }: Props) => {
  return (
    <div className={styles.inputDiv}>
      <label htmlFor={id} className={styles.labelDiv}>
        {label}
      </label>
      <input id={id} {...inputProps} className={styles.inputHalfDiv}></input>
      {error && <div>{error.message}</div>}
    </div>
  );
};
