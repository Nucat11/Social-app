import { DataSnapshot, onValue, ref, remove, set } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { db } from "../../../../lib/firebase/firebase";
import { AuthContext, ContextState } from "../../AuthContext/AuthContext";
import styles from "./Friends.module.css";

function follow(userId: string, user: string) {
  set(ref(db, "friends/" + userId +  '/' + user), "true");
}
function unFollow(
    userId: string, user: string
  ) {
    remove(ref(db, "friends/" + userId + '/' + user));
  }

  interface Props {
    userID:string
}


  export const Friends = ({userID}:Props) => {
    const[isFollowed, setIsFollowed] = useState(false);
    const { user } = useContext(AuthContext) as ContextState;

    useEffect(() => {
        onValue(
            ref(db, "friends/" + user!.uid + '/' + userID),
            (snapshot: DataSnapshot) => {
              if(snapshot.val()) {
                setIsFollowed(true);
              }
              else {
                setIsFollowed(false);
              }
      
            },
            (err) => {
              console.log(err);
            }
          );
          
    }, [userID])
    function handleFollow() {
        if(isFollowed === true) {
            unFollow(user!.uid, userID);
        }
        else {
            follow(user!.uid, userID);
        }
      }

    return( <button onClick={handleFollow} className={isFollowed ? styles.followActive : styles.followDisabled}>Follow</button>)
}