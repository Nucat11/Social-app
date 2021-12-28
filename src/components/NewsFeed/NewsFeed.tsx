import React from "react";
import { CreatePostForm } from "../Forms/CreatePostForm/CreatePostForm";
import styles from "./NewsFeed.module.css";

export const Newsfeed: React.FC = () => {
  return (
    <div className={styles.newsfeed}>
      <CreatePostForm />
    </div>
  );
};
