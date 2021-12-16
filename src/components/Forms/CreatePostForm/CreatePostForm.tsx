import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import { postContentSchema } from "../../../helpers/formSchemas";
import { push, ref, onValue, DataSnapshot, get } from "firebase/database";
import { db } from "../../../../lib/firebase/firebase";
import { AuthContext, ContextState } from "../../AuthContext/AuthContext";
import { useContext } from "react";
//state lub use effect

interface PostContent {
  postContent: string;
}

export const CreatePostForm: React.FC = () => {
  const { user } = useContext(AuthContext) as ContextState;
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
    writeUserData(user!.uid, data.postContent);
    reset();
  };
  const refer: any = ref(db, "users/" + user!.uid + "/posts");
  let data: Array<string> = [];

  onValue(
    refer,
    (snapshot: DataSnapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        data.push(childData.post);
      });
    },
    (err) => {
      console.log(err);
    }
  );

  get(refer)
    .then((snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        console.log(data);
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          data.push(childData.post);
        });
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label>Post Content</label>
          <input type="text" {...register("postContent")} />
          <div>{errors.postContent?.message}</div>
        </div>
        <button type="submit">Post</button>
      </form>
      {data.map((post, index) => (
        <p>{post}</p>
      ))}
    </div>
  );
};
