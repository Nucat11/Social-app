import React, { useContext, useState } from "react";
import CustomButton from "../../ReusableComponents/CustomButton/CustomButton";
import { PopupEditor } from "../../ReusableComponents/PopupEditor/PopupEditor";
import styles from "./CreatePostPopup.module.css";
import "react-quill/dist/quill.snow.css";
import { push, ref } from "firebase/database";
import { db } from "../../../../lib/firebase/firebase";
import { AuthContext, ContextState } from "../../AuthContext/AuthContext";

function writeUserData(userId: string, post: string) {
  let date: string;
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const hours = String(today.getHours()).padStart(2, "0");
  const minutes = String(today.getMinutes()).padStart(2, "0");
  date = hours + ":" + minutes + " " + mm + "/" + dd + "/" + yyyy;

  push(ref(db, "users/" + userId + "/posts"), {
    post,
    date,
  });
}
interface PostValue {
  data: string;
}

export const CreatePostPopup = () => {
  const [postVal, setPostVal] = useState<PostValue>({ data: "" });
  const [postContentError, setPostContentError] = useState<string>();
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const { user } = useContext(AuthContext) as ContextState;

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

  const handleChange = (data: string) => {
    setPostVal({ data });
    if (data.replace(/(<([^>]+)>)/gi, "") != "") {
      setPostContentError(undefined);
    }
  };
  return (
    <div>
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
    </div>
  );
};
