import { useContext } from "react";
import { Path } from "react-hook-form";
import { AuthContext, ContextState } from "../../AuthContext/AuthContext";
import { CommentForm } from "../../Forms/CommentForm/CommentForm";
import { Dropdown } from "../Dropdown/Dropdown";
import styles from "./SinglePost.module.css";

interface Props {
  postSingle: Inputs
  fullNameVal: string;
  userID: string;
}

export const SinglePost = ({ postSingle, fullNameVal, userID }: Props) => {
  const { user } = useContext(AuthContext) as ContextState;
  return (
    <div className={styles.singlePost}>
      <div className={styles.postHead}>
        <div>
          <h4>{fullNameVal}</h4>
          <p className={styles.date}>{postSingle.date}</p>
        </div>
        {user!.uid === userID && <Dropdown user={userID} postId={postSingle.id} />}
      </div>
      <div dangerouslySetInnerHTML={{ __html: postSingle.post }}></div>
      <CommentForm postSingle={postSingle} userId={userID} />
    </div>
  );
};
