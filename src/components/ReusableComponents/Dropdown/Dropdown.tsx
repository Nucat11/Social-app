import { ref, remove, update } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../../../../lib/firebase/firebase";
import { PopupEditor } from "../PopupEditor/PopupEditor";
import styles from "./Dropdown.module.css";

interface Props {
  user: string;
  postId: string;
}
interface PostValue {
  data: string;
}

function deleteUserData(userId: string, post: string) {
  remove(ref(db, "users/" + userId + "/posts/" + post));
}
function updateUserData(userId: string, post: string, postVal: string) {
  update(ref(db, "users/" + userId + "/posts/" + post), { post: postVal });
}

export const Dropdown = ({ user, postId }: Props) => {
  const [open, setOpen] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const wrapperRef = useRef(null);
  const [postContentError, setPostContentError] = useState<string>();
  const [postVal, setPostVal] = useState<PostValue>({ data: "" });
  const closeModal = () => setPopUp(false);
  useOutsideAlerter(wrapperRef);

  const handleChange = (data: string) => {
    setPostVal({ data });
    if (data.replace(/(<([^>]+)>)/gi, "") != "") {
      setPostContentError(undefined);
    }
  };

  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (postVal.data.replace(/(<([^>]+)>)/gi, "") !== "") {
      updateUserData(user, postId, postVal.data);
      document.querySelector(".ql-editor")!.innerHTML = "";
      setTimeout(() => {
        setPopUp(false);
      }, 0);
    } else {
      setPostContentError("Post content required");
    }
  };

  function onClickDelete() {
    deleteUserData(user, postId);
  }
  function onClickEdit() {
    setPopUp(true);
  }

  return (
    <div ref={wrapperRef} className={styles.dropdownDiv}>
      <div>
        <PopupEditor
          open={popUp}
          onSubmit={onSubmit}
          handleChange={handleChange}
          postContentError={postContentError}
          closeModal={closeModal}
          nameOfPopup="Edit post"
        />
        <button
          className={styles.dropdownToggle}
          onClick={() => setOpen(!open)}
        >
          &bull;&bull;&bull;
        </button>
        {open && (
          <div className={styles.dropdownMenu}>
            <button onClick={onClickDelete}> Usuń post </button>
            <button onClick={onClickEdit}> Edytuj post </button>
          </div>
        )}
      </div>
    </div>
  );
};
