import React from "react";
import { Path } from "react-hook-form";
import styles from'./CustomButton.module.css'

interface Props {
  border?: string;
  color: string;
  children?: React.ReactNode;
  height: string;
  onClick?: () => void;
  radius?: string
  width: string;
  type?: "button" | "submit" | "reset";
  id?: Path<Inputs>
  classButton?: string;
}

const CustomButton: React.FC<Props> = ({ 
    border,
    color,
    children,
    height,
    onClick, 
    radius,
    width,
    type,
    id,
    classButton
  }) => { 
  return (
    <button
      id={id}
      type={type}
      className={styles.customButton + " " + classButton} 
      onClick={onClick}
      style={{
         backgroundColor: color,
         border,
         borderRadius: radius,
         height,
         width
      }}

    >
    {children}
    </button>
  );
}

export default CustomButton;