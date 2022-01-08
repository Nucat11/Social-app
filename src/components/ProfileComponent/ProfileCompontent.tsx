import React, { useContext, useEffect, useState } from "react";
import styles from "./ProfileComponent.module.css";
import { ref, get, DatabaseReference, onValue } from "firebase/database";
import { db } from "../../../lib/firebase/firebase";
import { AuthContext, ContextState } from "../AuthContext/AuthContext";
import { CreatePostForm } from "../Forms/CreatePostForm/CreatePostForm";
import { FileDropUpload } from "../ReusableComponents/FileDropUpload/FileDropUpload";
import CustomButton from "../ReusableComponents/CustomButton/CustomButton";
import { Information } from "./Information/Information";
import { CreatePostPopup } from "./CreatePostPopup/CreatePostPopup";
import { Friends } from "./Friends/Friends";

interface Props {
  userID: string;
}

export const ProfileComponent = ({ userID }: Props) => {
  const { user } = useContext(AuthContext) as ContextState;
  const [fullname, setFullname] = useState("");
  const refer = ref(db, "users/" + userID);
  const [profileSettingsType, setProfileSettingsType] = useState("posts");
  const [imgAv, setImgAv] = useState("");

  useEffect(() => {

    onValue(
      refer,
      (snapshot) => {
        setFullname(snapshot.val().fullname);
        setImgAv(snapshot.val().avatar);
      }
    )


  },[userID])


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




  return (
    <div className={styles.profileDiv}>
      <div className={styles.profileHeader}>
        {user!.uid === userID ? (
          <FileDropUpload />
        ) : (
          <img
            src={
              imgAv
                ? imgAv
                : "https://res.cloudinary.com/nucat/image/upload/v1641135095/wallpaper-for-facebook-profile-photo_bh9nxd.jpg"
            }
            className={styles.avatar}
          ></img>
        )}
        <h1>{fullname}</h1>
        {user!.uid !== userID && <Friends userID={userID} />}
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
