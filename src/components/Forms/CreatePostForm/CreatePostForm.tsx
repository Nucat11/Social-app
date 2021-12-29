import React, { useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { push, ref, onValue, DataSnapshot } from "firebase/database";
import { db } from "../../../../lib/firebase/firebase";
import { AuthContext, ContextState } from "../../AuthContext/AuthContext";
import { useContext, useState } from "react";
import styles from "./CreatePost.module.css";
import CustomButton from "../../CustomButton/CustomButton";
import "react-quill/dist/quill.snow.css";
import { modules } from "../../QuillEditor/Editor";
import Popup from "reactjs-popup";

interface PostValue {
  data: string;
}

function writeUserData(userId: string, post: string) {
  push(ref(db, "users/" + userId + "/posts"), {
    post,
  });
}

export const CreatePostForm: React.FC = () => {
  const ReactQuill =
    typeof window === "object" ? require("react-quill") : () => false;
  const { user } = useContext(AuthContext) as ContextState;
  const [postsArr, setPostsArr] = useState<Inputs[]>([]);
  const [fullNameVal, setFullNameVal] = useState("");
  const [postVal, setPostVal] = useState<PostValue>({ data: "" });
  const [postContentError, setPostContentError] = useState<string>();
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  
  const refer = ref(db, "users/" + user!.uid + "/posts");
  const fullName = ref(db, "users/" + user!.uid + "/fullname");



  const onSubmit =  (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (postVal.data.replace(/(<([^>]+)>)/gi, "") !== "") {
      writeUserData(user!.uid, postVal.data);
      document.querySelector(".ql-editor")!.innerHTML = "";
      setTimeout(() => {
        setOpen(false);
      },0)
    } else {
      setPostContentError("Post content required");
    }
  };

  

  useEffect(() => {
    let posts: Inputs[] = [];
    onValue(
      refer,
      (snapshot: DataSnapshot) => {
        snapshot.forEach((childSnapshot) => {
          const postID = childSnapshot.key;
          const childData = childSnapshot.val();
          childData.id = postID;
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

  const handleChange = (data: string) => {
    setPostVal({ data });
    if (data.replace(/(<([^>]+)>)/gi, "") != "") {
      setPostContentError(undefined);
    }
  };
  return (
    <div className={styles.postForm}>
      <div className={styles.popupDiv}>
        <CustomButton
          color="#fbf3f3"
          border="none"
          height="50px"
          width="600px"
          type="button"
          radius="30px"
          onClick={() => setOpen(true)}
        >
          What are you thinking right now?
        </CustomButton>
      </div>

      <Popup
        open={open}
        modal
        position="center center"
        onClose={closeModal}
      >
        <form onSubmit={onSubmit} className={styles.form}>
          <ReactQuill
            modules={modules}
            onChange={handleChange}
            id="post"
            placeholder={"What are you thinking right now?"}
          ></ReactQuill>
          <p>{postContentError}</p>
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
      </Popup>

      {postsArr.map((postSingle) => (
        <div key={postSingle.id} className={styles.singlePost}>
          <h4>{fullNameVal}</h4>
          <div dangerouslySetInnerHTML={{ __html: postSingle.post }}></div>
        </div>
      ))}
    </div>
  );
};
