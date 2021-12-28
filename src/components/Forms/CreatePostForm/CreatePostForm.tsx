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
import CustomButton from "../../CustomButton/CustomButton";
import "react-quill/dist/quill.snow.css";
import { modules } from "../../QuillEditor/Editor";

export const CreatePostForm: React.FC = () => {
  const ReactQuill =
    typeof window === "object" ? require("react-quill") : () => false;
  const { user } = useContext(AuthContext) as ContextState;
  const [postsArr, setPostsArr] = useState<Inputs[]>([]);
  const [fullNameVal, setFullNameVal] = useState("");
  const [postVal, setPostVal] = useState() as any;
  

  function writeUserData(userId: string, post: string) {
    push(ref(db, "users/" + userId + "/posts"), {
      post,
    });
  }

  const onSubmit: SubmitHandler<Inputs> = async (event) => {
    event.preventDefault();
    writeUserData(user!.uid, postVal.data);
    document.querySelector(".ql-editor")!.innerHTML = "";

  };
  const refer = ref(db, "users/" + user!.uid + "/posts");
  const fullName = ref(db, "users/" + user!.uid + "/fullname");

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

  const handleChange = (data: any) => {
    setPostVal({ data });
  };

  return (
    <div className={styles.postForm}>
      <form onSubmit={onSubmit} noValidate className={styles.form}>
        <ReactQuill
          modules={modules}
          onChange={handleChange}
          id="post"
          placeholder={"What are you thinking right now?"}
        ></ReactQuill>
        <CustomButton
          type="submit"
          border=""
          color="gray"
          height="20px"
          width="200px"
        >
          Post
        </CustomButton>
      </form>

      {postsArr.map((postSingle, index) => (
        <div key={index} className={styles.singlePost}>
          <h4>{fullNameVal}</h4>
          <div dangerouslySetInnerHTML={{ __html: postSingle.post }}></div>
        </div>
      ))}
    </div>
  );
};
