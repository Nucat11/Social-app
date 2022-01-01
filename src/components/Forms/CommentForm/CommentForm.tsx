import { DataSnapshot, onValue, push, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { db } from "../../../../lib/firebase/firebase";
import { commentsSchema } from "../../../helpers/formSchemas";
import CustomButton from "../../ReusableComponents/CustomButton/CustomButton";
import { MyInput } from "../../ReusableComponents/Input/MyInput";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import styles from "./CommentForm.module.css";
interface Props {
  postSingle: {
    id: string;
  };

  user: string;
}

function writePostComment(
  userId: string,
  comment: string,
  postId: string,
  fullname: string
) {
  push(ref(db, "users/" + userId + "/posts/" + postId + "/comments"), {
    fullname,
    comment,
  });
}

export const CommentForm = ({ postSingle, user }: Props) => {
  const [commentsArr, setCommentsArr] = useState<Inputs[]>([]);
  const [fullNameVal, setFullNameVal] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(commentsSchema),
  });

  const postComment: SubmitHandler<Inputs> = (data) => {
    writePostComment(user, data.comment, postSingle.id, fullNameVal);
    reset();
  };
  const refer = ref(
    db,
    "users/" + user + "/posts/" + postSingle.id + "/comments"
  );
  const fullName = ref(db, "users/" + user + "/fullname");

  useEffect(() => {
    let comments: Inputs[] = [];
    onValue(
      refer,
      (snapshot: DataSnapshot) => {
        snapshot.forEach((childSnapshot) => {
          const postID = childSnapshot.key;
          const childData = childSnapshot.val();
          childData.id = postID;
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
        <div key={commentSingle.id}>
          <h2>{commentSingle.fullname}</h2>
          <p>{commentSingle.comment}</p>
        </div>
      ))}
    </div>
  );
};
