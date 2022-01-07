import React, { useContext } from "react";
import { AuthContext, ContextState } from "../../AuthContext/AuthContext";
import { CreatePostForm } from "../../Forms/CreatePostForm/CreatePostForm";
import { CreatePostPopup } from "../../ProfileComponent/CreatePostPopup/CreatePostPopup";
import styles from "./NewsFeed.module.css";

export const Newsfeed: React.FC = () => {
  const { user } = useContext(AuthContext) as ContextState;
  return (
    <div className={styles.newsfeed}>
      <CreatePostPopup />
      <CreatePostForm userID={user!.uid} />
    </div>
  );
};
