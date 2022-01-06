import { FormEventHandler } from "react";
import Popup from "reactjs-popup";
import { modules } from "../../QuillEditor/Editor";
import CustomButton from "../CustomButton/CustomButton";
import styles from "./PopupEditor.module.css";
const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false;

interface Props {
  open: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  handleChange: any;
  postContentError: string | undefined;
  closeModal: () => void;
  nameOfPopup?: string;
  
}




export const PopupEditor = ({
  open,
  onSubmit,
  handleChange,
  postContentError,
  closeModal,
  nameOfPopup,
}: Props) => {
  return (
      <Popup open={open} modal position="center center" onClose={closeModal} className='myPopup' closeOnDocumentClick>
        <h1>{nameOfPopup}</h1>
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
  );
};
