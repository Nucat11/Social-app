import { ref, remove, update } from "firebase/database";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Popup from "reactjs-popup";
import { db } from "../../../../../lib/firebase/firebase";
import { commentsSchema } from "../../../../helpers/formSchemas";
import { AuthContext, ContextState } from "../../../AuthContext/AuthContext";
import CustomButton from "../../../ReusableComponents/CustomButton/CustomButton";
import styles from "./CommentDropdown.module.css";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");

function deleteUserData(userId: string, post: string, commentID: string) {
  remove(
    ref(db, "users/" + userId + "/posts/" + post + "/comments/" + commentID)
  );
}
function updateUserData(
  userId: string,
  post: string,
  comment: string,
  commentVal: string,

) {
  update(
    ref(db, "users/" + userId + "/posts/" + post + "/comments/" + comment),
    {comment:commentVal}
  );
}
interface Props {
  postID: string;
  commentID: string;
  userID: string;
  commentCreatorID:string
}
export const CommentDropdown = ({ postID, commentID, userID, commentCreatorID }: Props) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(false);
  const wrapperRef = useRef(null);
  const { user } = useContext(AuthContext) as ContextState;
  useOutsideAlerter(wrapperRef);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(commentsSchema),
  });

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
  const onSubmit = (data:Inputs) => {
    setInput(false);
    updateUserData(userID, postID,commentID, data.comment);
  };

  function onClickDelete() {
    deleteUserData(userID, postID, commentID);
  }
  function onClickEdit() {
    setOpen(false);
    setInput(true);
  }

  return (
    <div ref={wrapperRef} className={styles.dropdownDiv}>
      <div>
        <button
          className={styles.dropdownToggle}
          onClick={() => setOpen(!open)}
        >
          &bull;&bull;&bull;
        </button>
        {open && (
          <div className={styles.dropdownMenu}>
             <CustomButton color="transparent" height="20px" width="100%" border="none" onClick={onClickDelete}>Delete comment</CustomButton>
            {commentCreatorID === user!.uid  && <CustomButton color="transparent" height="20px" width="100%" border="none" onClick={onClickEdit}>Edit comment</CustomButton>}
            
          </div>
        )}
      </div>
      {input && (
        <Popup
          className="myPopup"
          open={input}
          closeOnDocumentClick
          onClose={() => {
            setInput(false);
          }}
          position="center center"
        >
          <h2>Edit comment</h2>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <input
              id="editComment"
              type="text"
              {...register("comment")}
              placeholder="Aa"
            ></input>
            {errors.comment && <div>{errors.comment.message}</div>}

            <button>Edit</button>
          </form>
        </Popup>
      )}
    </div>
  );
};
