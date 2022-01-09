import { DataSnapshot, onValue, ref, remove, set } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { db } from "../../../../../lib/firebase/firebase";
import { AuthContext, ContextState } from "../../../AuthContext/AuthContext";
import CustomButton from "../../CustomButton/CustomButton";
import styles from "./Like.module.css";
import { LikeIcon } from "./LikeIcon";

function like(
  userId: string,
  postId: string,
  likeGiver: string,
  fullname: string
) {
  set(ref(db, "users/" + userId + "/posts/" + postId + "/likes/" + likeGiver), {
    fullname,
  });
}
function unLike(userId: string, postId: string, likeGiver: string) {
  remove(
    ref(db, "users/" + userId + "/posts/" + postId + "/likes/" + likeGiver)
  );
}
interface Props {
  userID: string;
  postSingle: Inputs;
}

export const Like = ({ userID, postSingle }: Props) => {
  const [likeExists, setLikeExists] = useState(false);

  const { user } = useContext(AuthContext) as ContextState;
  const fullName = ref(db, "users/" + user!.uid + "/fullname");
  const [fullname, setFullname] = useState("");
  useEffect(() => {
    let isCancelled = false;
    onValue(
      fullName,
      (snapshot: DataSnapshot) => {
        setFullname(snapshot.val());
      },
      (err) => {
        console.log(err);
      }
    );

    onValue(
      ref(
        db,
        "users/" + userID + "/posts/" + postSingle.id + "/likes/" + user!.uid
      ),
      (snapshot: DataSnapshot) => {
        if (!isCancelled) {
          if (snapshot.val()) {
            setLikeExists(true);
          } else {
            setLikeExists(false);
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
    return () => {
      isCancelled = true;
    };
  }, []);
  function handleLike() {
    if (likeExists) {
      unLike(userID, postSingle.id, user!.uid);
    } else {
      like(userID, postSingle.id, user!.uid, fullname);
    }
  }

  return (<>

    <CustomButton
      onClick={handleLike}
      classButton={!likeExists ? styles.likeActive : styles.likeDisabled}
      color="transparent"
      width="50%"
      border="none"
      height="30px"
    >
         <LikeIcon/> Like
    </CustomButton>
  </>
  );
};
