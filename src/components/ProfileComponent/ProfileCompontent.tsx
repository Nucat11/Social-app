import React, { useContext, useState } from "react";
import styles from "./ProfileComponent.module.css";
import { ref, get } from "firebase/database";
import { db } from "../../../lib/firebase/firebase";
import { AuthContext, ContextState } from "../AuthContext/AuthContext";
import { CreatePostForm } from "../Forms/CreatePostForm/CreatePostForm";
import { FileDropUpload } from "../ReusableComponents/FileDropUpload/FileDropUpload";
import CustomButton from "../ReusableComponents/CustomButton/CustomButton";
import { Information } from "./Information/Information";

export const ProfileComponent: React.FC = () => {
  const { user } = useContext(AuthContext) as ContextState;
  const [fullname, setFullname] = useState("");
  const refer = ref(db, "users/" + user!.uid);
  const [profileSettingsType, setProfileSettingsType] = useState("posts");

  get(refer).then((snapshot) => {
    setFullname(snapshot.val().fullname);
  });

  const renderSwitch = (param: any) => {
    switch (param) {
      case "posts":
        return <CreatePostForm />;
      case "information":
        return <Information/>;
      default:
        return <CreatePostForm />;
    }
  };

  return (
    <div className={styles.profileDiv}>
      <div className={styles.profileHeader}>
        <FileDropUpload />
        <h1>{fullname}</h1>
      </div>
      <hr />
      <div className={styles.divWithButtons}>
        <CustomButton
          color="white"
          height="50px"
          width="100px"
          onClick={() => {
            setProfileSettingsType("posts");
          }}
        >
          Post
        </CustomButton>
        <CustomButton
          color="white"
          height="50px"
          width="100px"
          onClick={() => {
            setProfileSettingsType("information");
          }}
        >
          Information
        </CustomButton>
      </div>

      {renderSwitch(profileSettingsType)}
    </div>
  );
};
