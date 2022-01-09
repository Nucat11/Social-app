import React, { useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/no-const-requires
import { ref, onValue, DataSnapshot } from "firebase/database";
import { db } from "../../../../lib/firebase/firebase";
import { useState } from "react";
import styles from "./CreatePost.module.css";
import { SinglePost } from "../../ReusableComponents/SinglePost/SinglePost";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");

interface Props {
  userID: string;
}

export const CreatePostForm = ({ userID }: Props) => {
  const [postsArr, setPostsArr] = useState<Inputs[]>([]);
  const [fullNameVal, setFullNameVal] = useState("");
  const [avatar, setAvatar] = useState("");
  const refer = ref(db, "users/" + userID + "/posts");
  const fullName = ref(db, "users/" + userID + "/fullname");
  const avatarRef = ref(db, "users/" + userID + "/avatar");

  useEffect(() => {
    let posts: Inputs[] = [];
    let isCancelled = false;
    onValue(
      refer,
      (snapshot: DataSnapshot) => {
        snapshot.forEach((childSnapshot) => {
          const postID = childSnapshot.key;
          const childData = childSnapshot.val();
          childData.id = postID;
          posts.push(childData);
        });
        if (!isCancelled) {
          setPostsArr(posts);
          posts = [];
        }

      },
      (err) => {
        console.log(err);
      }
    );
    onValue(
      fullName,
      (snapshot: DataSnapshot) => {
        setFullNameVal(snapshot.val());
      },
      (err) => {
        console.log(err);
      }
      
    );
    onValue(
      avatarRef,
      (snapshot: DataSnapshot) => {
        setAvatar(snapshot.val());
      },
      (err) => {
        console.log(err);
      }
      
    );
    return () => {
      isCancelled = true;
    };
  }, [userID]);

  return (
    <div className={styles.postForm}>
      {postsArr.map((postSingle) => (
        <SinglePost
          key={postSingle.id}
          postSingle={postSingle}
          fullNameVal={fullNameVal}
          userID={userID}
          avatar={avatar}
        />
      ))}
    </div>
  );
};
