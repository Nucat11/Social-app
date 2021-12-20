import React from "react";
import { SignOutButton } from "../SignOutButton";
import { CreatePostForm } from "../Forms/CreatePostForm/CreatePostForm";
import styles from "./NewsFeed.module.css";

export const Newsfeed: React.FC = () => {
  return (
    <div className={styles.newsfeed}>
      <h1> Tablica</h1>
      <CreatePostForm />
      <SignOutButton />
    </div>
  );
};
