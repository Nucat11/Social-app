import {
  ref,
  startAt,
  orderByChild,
  DataSnapshot,
  query,
  get,
  endAt,
  onValue,
} from "firebase/database";
import React, { useEffect, useState } from "react";
import { db } from "../../../../lib/firebase/firebase";
import styles from "./Search.module.css";

function titleCase(str:string) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' '); 
 }

export const Search: React.FC = () => {
  const [value, setValue] = useState("");

  function handleChange(e: any) {
    setValue(titleCase(e.target.value));
  }


    const referNav = query(
      ref(db, "/users"),
      orderByChild("fullname"),
      startAt(value),
      endAt(value + "~")
    );

    onValue(
        referNav,
        (snapshot1: DataSnapshot) => {
          snapshot1.forEach((childSnapshot1) => {
            console.log(childSnapshot1.val())
          });
        },
        (err) => {
          console.log(err);
        }
      );


  return (
    <div className={styles.navbarItem}>
      <input onChange={handleChange}></input>
    </div>
  );
};
