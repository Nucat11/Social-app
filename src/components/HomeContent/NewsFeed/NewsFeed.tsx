import {
  DatabaseReference,
  DataSnapshot,
  onValue,
  ref,
} from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../../../lib/firebase/firebase";
import { AuthContext, ContextState } from "../../AuthContext/AuthContext";
import { CreatePostForm } from "../../Forms/CreatePostForm/CreatePostForm";
import { CreatePostPopup } from "../../ProfileComponent/CreatePostPopup/CreatePostPopup";
import { SinglePost } from "../../ReusableComponents/SinglePost/SinglePost";
import styles from "./NewsFeed.module.css";

export const Newsfeed: React.FC = () => {
  const { user } = useContext(AuthContext) as ContextState;
  const refer = ref(db, "friends/" + user!.uid);
  const [followers, setFollowers] = useState([]);
  useEffect(() => {
    let followingArr: Inputs[] = [];
    onValue(refer, (snapshot: DataSnapshot) => {
      snapshot.forEach((childSnapshot) => {
        followingArr.push(childSnapshot.key);
      })
      setFollowers(followingArr);
    })
  },[])

  let id = 0;

  return (
    <div className={styles.newsfeed}>
      <CreatePostPopup />
      <CreatePostForm userID={user!.uid} />
      {followers!.map((postSingle) => {
        id++;
        return <CreatePostForm userID={postSingle} key={id}/>

      })}
    </div>
  );
};
