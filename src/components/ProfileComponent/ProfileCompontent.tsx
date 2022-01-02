import React, { useContext, useState } from "react";
import styles from "./ProfileComponent.module.css";
import { ref, get } from "firebase/database";
import { db } from "../../../lib/firebase/firebase";
import { AuthContext, ContextState } from "../AuthContext/AuthContext";
import { CreatePostForm } from "../Forms/CreatePostForm/CreatePostForm";
import { FileDropUpload } from "../ReusableComponents/FileDropUpload/FileDropUpload";

export const ProfileComponent: React.FC = () => {
  const { user } = useContext(AuthContext) as ContextState;
  const [fullname, setFullname] = useState("");
  const refer = ref(db, "users/" + user!.uid);

  get(refer).then((snapshot) => {
    setFullname(snapshot.val().fullname);
  });

  return (
    <div className={styles.profileDiv}>
      <div className={styles.profileHeader}>
        <FileDropUpload />
        <h1>{fullname}</h1>
      </div>

      <CreatePostForm />
    </div>
  );
};
