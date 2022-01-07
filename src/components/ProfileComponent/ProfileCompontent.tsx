import React, { useContext, useState } from "react";
import styles from "./ProfileComponent.module.css";
import { ref, get } from "firebase/database";
import { db } from "../../../lib/firebase/firebase";
import { AuthContext, ContextState } from "../AuthContext/AuthContext";
import { CreatePostForm } from "../Forms/CreatePostForm/CreatePostForm";
import { FileDropUpload } from "../ReusableComponents/FileDropUpload/FileDropUpload";
import CustomButton from "../ReusableComponents/CustomButton/CustomButton";
import { Information } from "./Information/Information";
import { CreatePostPopup } from "./CreatePostPopup/CreatePostPopup";

interface Props {
  userID: string;
}

export const ProfileComponent = ({ userID }: Props) => {
  const { user } = useContext(AuthContext) as ContextState;
  const [fullname, setFullname] = useState("");
  const refer = ref(db, "users/" + userID);
  const [profileSettingsType, setProfileSettingsType] = useState("posts");
  const [img, setImg] = useState("");

  get(refer).then((snapshot) => {
    setFullname(snapshot.val().fullname);
  });
  get(refer).then((snapshot) => {
    setImg(snapshot.val().avatar);
  });

  const renderSwitch = (param: string) => {
    switch (param) {
      case "posts":
        return (
          <div className={styles.postForm}>
            {user!.uid === userID && (
              <div>
                <CreatePostPopup />
                <CreatePostForm userID={user!.uid} />
              </div>
            )}
            {user!.uid !== userID && (
              <div>
                <CreatePostForm userID={userID} />
              </div>
            )}
          </div>
        );
      case "information":
        return <Information />;
      default:
        return (
          <div className={styles.postForm}>
            {user!.uid === userID && (
              <div>
                <CreatePostPopup />
                <CreatePostForm userID={user!.uid} />
              </div>
            )}
            {user!.uid !== userID && (
              <div>
                <CreatePostForm userID={userID} />
              </div>
            )}
          </div>
        );
    }
  };

  function fileUpload() {
    if (user!.uid === userID) {
      return <FileDropUpload />;
    } else {
      return (
        <img
          src={
            img
              ? img
              : "https://res.cloudinary.com/nucat/image/upload/v1641135095/wallpaper-for-facebook-profile-photo_bh9nxd.jpg"
          }
          className={styles.avatar}
        ></img>
      );
    }
  }

  return (
    <div className={styles.profileDiv}>
      <div className={styles.profileHeader}>
        {fileUpload()}
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
