import { ref, onValue, DataSnapshot } from "firebase/database";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { db } from "../../../../lib/firebase/firebase";
import { AuthContext, ContextState } from "../../AuthContext/AuthContext";
import { CommentForm } from "../../Forms/CommentForm/CommentForm";
import CustomButton from "../CustomButton/CustomButton";
import { Dropdown } from "../Dropdown/Dropdown";
import { Like } from "./Like/Like";
import styles from "./SinglePost.module.css";

interface Props {
  postSingle: Inputs;
  fullNameVal: string;
  userID: string;
  avatar: string;
}

export const SinglePost = ({
  postSingle,
  fullNameVal,
  userID,
  avatar,
}: Props) => {
  const { user } = useContext(AuthContext) as ContextState;
  const [open, setOpen] = useState(false);
  const [likeNumber, setLikeNumber] = useState(0);
  const [commentsNumber, setCommentsNumber] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    onValue(
      ref(db, "users/" + userID + "/posts/" + postSingle.id + "/likes/"),
      (snapshot: DataSnapshot) => {
        if (!isCancelled) {
          if (snapshot.val()) {
            setLikeNumber(Object.keys(snapshot.val()).length);
          } else {
            setLikeNumber(0);
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
    onValue(
      ref(db, "users/" + userID + "/posts/" + postSingle.id + "/comments"),
      (snapshot: DataSnapshot) => {
        if (!isCancelled) {
          if (snapshot.val()) {
            setCommentsNumber(Object.keys(snapshot.val()).length);
          } else {
            setCommentsNumber(0);
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );

    return () => {
      isCancelled = true;
    };
  }, [likeNumber, commentsNumber]);

  return (
    <div className={styles.singlePost}>
      <div className={styles.postHead}>
        <div className={styles.postInfo}>
          <img src={avatar}></img>
          <div>
           {user!.uid !== userID ? <h4><Link href={`/user/${userID}`}>{fullNameVal}</Link></h4> : <h4><Link href={`/profile`}>{fullNameVal}</Link></h4>}
            <p className={styles.date}>{postSingle.date}</p>
          </div>
        </div>
        {user!.uid === userID && (
          <Dropdown user={userID} postId={postSingle.id} />
        )}
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: postSingle.post }}
        className={styles.postContent}
      ></div>
      <div className={styles.likeDiv}>
        {likeNumber !== 0 && (
          <div>
            <div className={styles.likeIcon}></div>
            <p>{likeNumber}</p>
          </div>
        )}
        {commentsNumber !== 0 && (
          <p
            className={styles.commentP}
            onClick={() => {
              setOpen(!open);
            }}
          >
            {commentsNumber === 1
              ? `${commentsNumber} comment`
              : `${commentsNumber} comments`}
          </p>
        )}
      </div>

      <hr />
      <div className={styles.postFeatures}>
        <Like userID={userID} postSingle={postSingle} />
        <CustomButton
          onClick={() => {
            setOpen(true);
          }}
          color="transparent"
          height="30px"
          width="50%"
          border="none"
        >
          Comments
        </CustomButton>
      </div>
      {open === true && (
        <div>
          <hr />
          <CommentForm
            postSingle={postSingle}
            userId={userID}
            avatar={avatar}
          />
        </div>
      )}
    </div>
  );
};
