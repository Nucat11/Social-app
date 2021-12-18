import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import { postContentSchema } from "../../../helpers/formSchemas";
import { push, ref, onValue, DataSnapshot } from "firebase/database";
import { db } from "../../../../lib/firebase/firebase";
import { AuthContext, ContextState } from "../../AuthContext/AuthContext";
import { useContext, useState } from "react";
import { Input } from "../../Input/Input";

interface PostContent {
  post: string;
}

export const CreatePostForm: React.FC = () => {
  const { user } = useContext(AuthContext) as ContextState;
  const [postsArr, setPostsArr] = useState<PostContent[]>([]);

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
  } = useForm<PostContent>({
    resolver: yupResolver(postContentSchema),
  });

  const onSubmit: SubmitHandler<PostContent> = async (data) => {
    writeUserData(user!.uid, data.post);
    reset();
  };
  const refer = ref(db, "users/" + user!.uid + "/posts");

  useEffect(() => {
    let posts: PostContent[] = [];
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
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          id="post"
          type="text"
          label="New Post"
          error={errors.post}
          {...register("post")}
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
