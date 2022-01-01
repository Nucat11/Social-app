import { Path } from "react-hook-form";
import { CommentForm } from "../../Forms/CommentForm/CommentForm";
import { Dropdown } from "../Dropdown/Dropdown";
import styles from "./SinglePost.module.css";

interface Props {
  postSingle: Inputs
  fullNameVal: string;
  user: string;
}

export const SinglePost = ({ postSingle, fullNameVal, user }: Props) => {
  return (
    <div className={styles.singlePost}>
      <div className={styles.postHead}>
        <div>
          <h4>{fullNameVal}</h4>
          <p className={styles.date}>{postSingle.date}</p>
        </div>
        <Dropdown user={user} postId={postSingle.id} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: postSingle.post }}></div>
      <CommentForm postSingle={postSingle} user={user} />
    </div>
  );
};
