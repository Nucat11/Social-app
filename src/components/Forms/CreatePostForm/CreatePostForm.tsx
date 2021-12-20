import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import { postContentSchema } from "../../../helpers/formSchemas";
import { push, ref, onValue, DataSnapshot } from "firebase/database";
import { db } from "../../../../lib/firebase/firebase";
import { AuthContext, ContextState } from "../../AuthContext/AuthContext";
import { useContext, useState } from "react";
import { MyInput } from "../../Input/MyInput";
import styles from "./CreatePost.module.css";

export const CreatePostForm: React.FC = () => {
  const { user } = useContext(AuthContext) as ContextState;
  const [postsArr, setPostsArr] = useState<Inputs[]>([]);

  function writeUserData(userId: string, post: string) {
    push(ref(db, "users/" + userId + "/posts"), {
      post,
    });
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(postContentSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    writeUserData(user!.uid, data.post);
    reset();
  };
  const refer = ref(db, "users/" + user!.uid + "/posts");

  useEffect(() => {
    let posts: Inputs[] = [];
    onValue(
      refer,
      (snapshot: DataSnapshot) => {
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          posts.push(childData);
        });
        setPostsArr(posts);
        posts = [];
      },
      (err) => {
        console.log(err);
      }
    );
  }, [onValue]);

  return (
    <div className={styles.postForm}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={styles.form}
      >
        <MyInput
          id="post"
          type="text"
          label="New post"
          error={errors.post}
          register={register}
          placeholder="Some text..."
        />
        <button type="submit">Post</button>
      </form>

      {postsArr.map((postSingle, index) => (
        <div key={index}>
          <p>{postSingle.post}</p>
        </div>
      ))}
    </div>
  );
};
