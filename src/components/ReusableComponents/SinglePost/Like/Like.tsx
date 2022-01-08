import { DataSnapshot, onValue, ref, remove, set } from "firebase/database";
import { useContext, useEffect, useState } from "react"
import { db } from "../../../../../lib/firebase/firebase";
import { AuthContext, ContextState } from "../../../AuthContext/AuthContext";
import styles from './Like.module.css'
function like(
    userId: string,
    postId: string,
    likeGiver: string,
    fullname: string
  ) {
    set(ref(db, "users/" + userId + "/posts/" + postId + "/likes/" + likeGiver), {fullname});
  }
  function unLike(
    userId: string,
    postId: string,
    likeGiver: string,
  ) {
    remove(ref(db, "users/" + userId + "/posts/" + postId + "/likes/" + likeGiver));
  }
interface Props {
    userID:string
    postSingle: Inputs
}

export const Like = ({userID,postSingle}:Props) => {
    const[likeExists, setLikeExists] = useState(false);

    const { user } = useContext(AuthContext) as ContextState;
    const fullName = ref(db, "users/" + user!.uid + "/fullname");
    const [fullname, setFullname] = useState('')
    useEffect(() => {
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
            ref(db, "users/" + userID + "/posts/" + postSingle.id + "/likes/" +  user!.uid),
            (snapshot: DataSnapshot) => {
              if(snapshot.val()) {
                setLikeExists(true);
              }
              else {
                setLikeExists(false);
              }
      
            },
            (err) => {
              console.log(err);
            }
          );
          
    }, [])
    function handleLike() {
        if(likeExists) {
          unLike(userID, postSingle.id, user!.uid);
        }
        else {
          like(userID, postSingle.id, user!.uid, fullname);
        }
      }

    return( <button onClick={handleLike} className={likeExists ? styles.likeActive : styles.likeDisabled}>Like</button>)
}