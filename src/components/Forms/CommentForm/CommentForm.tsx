import { DataSnapshot, onValue, push, ref } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { db } from "../../../../lib/firebase/firebase";
import { commentsSchema } from "../../../helpers/formSchemas";
import { AuthContext, ContextState } from "../../AuthContext/AuthContext";
import CustomButton from "../../ReusableComponents/CustomButton/CustomButton";
import { CommentDropdown } from "./CommentDropdown/CommentDropdown";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import styles from "./CommentForm.module.css";
interface Props {
  postSingle: {
    id: string;
  };
  avatar: string;
  userId: string;
}

function writePostComment(
  userId: string,
  comment: string,
  postId: string,
  fullname: string,
  id: string
) {
  let date: string;
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const hours = String(today.getHours()).padStart(2, "0");
  const minutes = String(today.getMinutes()).padStart(2, "0");
  date = hours + ":" + minutes + " " + mm + "/" + dd + "/" + yyyy;

  push(ref(db, "users/" + userId + "/posts/" + postId + "/comments"), {
    fullname,
    comment,
    id,
    date
  });
}

export const CommentForm = ({ postSingle, userId, avatar }: Props) => {
  const [commentsArr, setCommentsArr] = useState<Inputs[]>([]);
  const [fullNameVal, setFullNameVal] = useState("");
  const { user } = useContext(AuthContext) as ContextState;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(commentsSchema),
  });
  const postComment: SubmitHandler<Inputs> = (data) => {
    writePostComment(
      userId,
      data.comment,
      postSingle.id,
      fullNameVal,
      user!.uid
    );
    reset();
  };
  const refer = ref(
    db,
    "users/" + userId + "/posts/" + postSingle.id + "/comments"
  );
  const fullName = ref(db, "users/" + user!.uid + "/fullname");

  useEffect(() => {
    let comments: Inputs[] = [];
    onValue(
      refer,
      (snapshot: DataSnapshot) => {
        snapshot.forEach((childSnapshot) => {
          const postID = childSnapshot.key;
          const childData = childSnapshot.val();
          childData.parentID = postID;
          comments.push(childData);
        });
        setCommentsArr(comments);
        comments = [];
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
  }, []);

  return (
    <div>
      <form
        className={styles.commentForm}
        onSubmit={handleSubmit(postComment)}
        noValidate
      >
        <input
          id={postSingle.id}
          type="text"
          {...register("comment")}
          placeholder="Comment..."
        ></input>
        {errors.comment && <div>{errors.comment.message}</div>}
        <CustomButton
          type="submit"
          border="none"
          color="#111344a9"
          height="50px"
          radius="40px"
          width="40%"
        />
      </form>
      {commentsArr.map((commentSingle) => (
        <div key={commentSingle.parentID} className={styles.comment}>
          <div className={styles.commentDiv}>
          <div className={styles.avatarWithContent}>
          <img src={avatar}></img>
          <div className={styles.commentContent}>
            <h2>{commentSingle.fullname}</h2>
            <p>{commentSingle.comment}</p>
          </div>
          </div>
            <p className={styles.date}>{commentSingle.date}</p>
          </div>

          {(commentSingle.id === user!.uid || userId === user!.uid) && (
            <CommentDropdown
              postID={postSingle.id}
              commentID={commentSingle.parentID}
              userID={userId}
              commentCreatorID={commentSingle.id}
            />
          )}  
        </div>
      ))}
    </div>
  );
};
