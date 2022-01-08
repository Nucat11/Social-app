import { set, ref, onValue, DataSnapshot, remove } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { db } from "../../../../lib/firebase/firebase";
import { AuthContext, ContextState } from "../../AuthContext/AuthContext";
import { CommentForm } from "../../Forms/CommentForm/CommentForm";
import { Dropdown } from "../Dropdown/Dropdown";
import { Like } from "./Like/Like";
import styles from "./SinglePost.module.css";

interface Props {
  postSingle: Inputs;
  fullNameVal: string;
  userID: string;
}

export const SinglePost = ({ postSingle, fullNameVal, userID }: Props) => {
  const { user } = useContext(AuthContext) as ContextState;
  const [open, setOpen] = useState(false);
  const [likeNumber, setLikeNumber] = useState(0);
 
  useEffect(() => {
    onValue(
      ref(db, "users/" + userID + "/posts/" + postSingle.id + "/likes/"),
      (snapshot: DataSnapshot) => {
        if(snapshot.val()) {
          setLikeNumber(Object.keys(snapshot.val()).length);
        }
        else {
          setLikeNumber(0)
        }

      },
      (err) => {
        console.log(err);
      }
    );
  },[])

  return (
    <div className={styles.singlePost}>
      <div className={styles.postHead}>
        <div>
          <h4>{fullNameVal}</h4>
          <p className={styles.date}>{postSingle.date}</p>
        </div>
        {user!.uid === userID && (
          <Dropdown user={userID} postId={postSingle.id} />
        )}
      </div>
      <div dangerouslySetInnerHTML={{ __html: postSingle.post }}></div>
      <div>
        <p>{likeNumber} Likes</p>
      </div>
      <hr />
      <div className={styles.postFeatures}>
        <Like userID={userID} postSingle={postSingle}/>
        <button
          onClick={() => {
            setOpen(true);
          }}
        >
          Comments
        </button>
      </div>
      {open === true && <CommentForm postSingle={postSingle} userId={userID} />}
    </div>
  );
};
