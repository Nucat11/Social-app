import React, { useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/no-const-requires
import { push, ref, onValue, DataSnapshot } from "firebase/database";
import { db } from "../../../../lib/firebase/firebase";
import { AuthContext, ContextState } from "../../AuthContext/AuthContext";
import { useContext, useState } from "react";
import styles from "./CreatePost.module.css";
import CustomButton from "../../ReusableComponents/CustomButton/CustomButton";
import "react-quill/dist/quill.snow.css";
import { Dropdown } from "../../ReusableComponents/Dropdown/Dropdown";
import { PopupEditor } from "../../ReusableComponents/PopupEditor/PopupEditor";
import { SubmitHandler, useForm } from "react-hook-form";
import { CommentForm } from "../CommentForm/CommentForm";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
interface PostValue {
  data: string;
}

function writeUserData(userId: string, post: string) {
  let date: string;
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  const hours = String(today.getHours()).padStart(2, "0");
  const minutes = String(today.getMinutes()).padStart(2, "0");
  date = hours + ":" + minutes + " " + mm + "/" + dd + "/" + yyyy;

  push(ref(db, "users/" + userId + "/posts"), {
    post,
    date,
  });
}


export const CreatePostForm: React.FC = () => {
  const { user } = useContext(AuthContext) as ContextState;
  const [postsArr, setPostsArr] = useState<Inputs[]>([]);
  const [fullNameVal, setFullNameVal] = useState("");
  const [postVal, setPostVal] = useState<PostValue>({ data: "" });
  const [postContentError, setPostContentError] = useState<string>();
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  const refer = ref(db, "users/" + user!.uid + "/posts");
  const fullName = ref(db, "users/" + user!.uid + "/fullname");

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (postVal.data.replace(/(<([^>]+)>)/gi, "") !== "") {
      writeUserData(user!.uid, postVal.data);
      document.querySelector(".ql-editor")!.innerHTML = "";
      setTimeout(() => {
        setOpen(false);
      }, 0);
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

      <PopupEditor
        open={open}
        onSubmit={onSubmit}
        handleChange={handleChange}
        postContentError={postContentError}
        closeModal={closeModal}
      />

      {postsArr.map((postSingle) => (
        <div key={postSingle.id} className={styles.singlePost}>
          <div className={styles.postHead}>
            <div>
              <h4>{fullNameVal}</h4>
              <p className={styles.date}>{postSingle.date}</p>
            </div>
            <Dropdown user={user!.uid} postId={postSingle.id} />
          </div>
          <div dangerouslySetInnerHTML={{ __html: postSingle.post }}></div>
          <CommentForm postSingle={postSingle} user={user!.uid}/>
        </div>
      ))}
    </div>
  );
};
