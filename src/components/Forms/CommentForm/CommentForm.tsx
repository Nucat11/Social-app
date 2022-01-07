import {
  child,
  DataSnapshot,
  onValue,
  push,
  ref,
  update,
} from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { db } from "../../../../lib/firebase/firebase";
import { commentsSchema } from "../../../helpers/formSchemas";
import { AuthContext, ContextState } from "../../AuthContext/AuthContext";
import CustomButton from "../../ReusableComponents/CustomButton/CustomButton";
import { MyInput } from "../../ReusableComponents/Input/MyInput";
import { CommentDropdown } from "./CommentDropdown/CommentDropdown";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import styles from "./CommentForm.module.css";
interface Props {
  postSingle: {
    id: string;
  };

  userId: string;
}

function writePostComment(
  userId: string,
  comment: string,
  postId: string,
  fullname: string,
  id: string
) {
  push(ref(db, "users/" + userId + "/posts/" + postId + "/comments"), {
    fullname,
    comment,
    id,
  });
}

export const CommentForm = ({ postSingle, userId }: Props) => {
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
  }, [onValue]);

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
          placeholder="Aa"
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
          <div>
            <h2>{commentSingle.fullname}</h2>
              <p>{commentSingle.comment}</p>
          </div>
          {commentSingle.id === user!.uid && (
            <CommentDropdown
              postID={postSingle.id}
              commentID={commentSingle.parentID}
              user={userId}
            />
          )}
        </div>
      ))}
    </div>
  );
};
