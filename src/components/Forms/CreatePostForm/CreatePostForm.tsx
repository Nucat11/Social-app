import React, { useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/no-const-requires
import { ref, onValue, DataSnapshot } from "firebase/database";
import { db } from "../../../../lib/firebase/firebase";
import { AuthContext, ContextState } from "../../AuthContext/AuthContext";
import { useContext, useState } from "react";
import styles from "./CreatePost.module.css";
import { SinglePost } from "../../ReusableComponents/SinglePost/SinglePost";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");

interface Props {
  userID: string;
}

export const CreatePostForm = ({ userID }: Props) => {
  const { user } = useContext(AuthContext) as ContextState;
  const [postsArr, setPostsArr] = useState<Inputs[]>([]);
  const [fullNameVal, setFullNameVal] = useState("");
  const refer = ref(db, "users/" + userID + "/posts");
  const fullName = ref(db, "users/" + userID + "/fullname");

  useEffect(() => {
    let posts: Inputs[] = [];
    onValue(
      refer,
      (snapshot: DataSnapshot) => {
        snapshot.forEach((childSnapshot) => {
          const postID = childSnapshot.key;
          const childData = childSnapshot.val();
          childData.id = postID;
          posts.push(childData);
        });
        setPostsArr(posts);
        posts = [];
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
  }, [onValue]);

  return (
    <div className={styles.postForm}>
      {postsArr.map((postSingle) => (
        <SinglePost
          key={postSingle.id}
          postSingle={postSingle}
          fullNameVal={fullNameVal}
          userID={userID}
        />
      ))}
    </div>
  );
};
