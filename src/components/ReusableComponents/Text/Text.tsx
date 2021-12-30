import React from "react";

interface Props {
    border?: string;
    color: string;
    children?: React.ReactNode;
    height: string;
    onClick?: () => void;
    radius?: string
    width: string;
    type?: "button" | "submit" | "reset";
  }
  