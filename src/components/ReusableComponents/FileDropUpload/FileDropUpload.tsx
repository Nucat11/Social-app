import React, { useContext, useEffect, useState } from "react";
import { db, storage } from "../../../../lib/firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL, list } from "firebase/storage";
import { AuthContext, ContextState } from "../../AuthContext/AuthContext";
import { useForm } from "react-hook-form";
import { avatarValidationSchema } from "../../../helpers/formSchemas";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { yupResolver } = require("@hookform/resolvers/yup");
import styles from "./FileDropUpload.module.css";
import { update, ref as realtimeRef } from "firebase/database";
const metadata = {
  contentType: "image/jpeg",
};

export const FileDropUpload = () => {
  const [image, setImage] = useState<File | undefined>(undefined);
  const { user } = useContext(AuthContext) as ContextState;
  const [error, setError] = useState<string | undefined>(undefined);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(avatarValidationSchema),
  });
  const storageRef = ref(storage, "images/" + user!.uid + "/avatar");
  const storageRefParent = ref(storage, "images/" + user!.uid );
  const handleChange = (e: any) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      const preview = URL.createObjectURL(e.target.files[0]);
      document
        .querySelector(".FileDropUpload_avatarDiv__O2q_f label img")!
        .setAttribute("src", preview);
    }
  };

  const handleUpload = () => {
    if (image) {
      const uploadTask = uploadBytesResumable(storageRef, image!, metadata);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              break;
            case "storage/canceled":
              break;

            case "storage/unknown":
              break;
          }
        },
        () => {
          getDownloadURL(storageRef).then((downloadURL) => {
            document
              .querySelector(".FileDropUpload_avatarDiv__O2q_f label img")!
              .setAttribute("src", downloadURL);
          });
          reset();
          setImage(undefined);
        }
      );
    } else if (!image) {
      setError("File required");
    }
  };
  useEffect(() => {
    list(storageRefParent).then((res) => {
      if(res.items.length != 0) {
        getDownloadURL(storageRef)
          .then((downloadURL) => {
            document
              .querySelector(".FileDropUpload_avatarDiv__O2q_f label img")!
              .setAttribute("src", downloadURL);
              update(realtimeRef(db, "users/" + user!.uid), {avatar: downloadURL})
          })
          .catch((error) => {
            console.log(error);
          });
      }

    })

  }, []);

  useEffect(() => {
    setError(undefined);
  }, [image]);

  return (
    <div className={styles.avatarDiv}>
      <form onSubmit={handleSubmit(handleUpload)} noValidate>
        <label htmlFor="avatar">
          <img src="https://res.cloudinary.com/nucat/image/upload/v1641135095/wallpaper-for-facebook-profile-photo_bh9nxd.jpg" />
        </label>
        <input
          type="file"
          id="avatar"
          {...register("avatar")}
          onChange={handleChange}
        ></input>
        <button>Click here to update</button>
        {errors.avatar && <div>{errors.avatar.message}</div>}
        {error && <div>{error}</div>}
      </form>
    </div>
  );
};
