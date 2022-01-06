import {
  ref,
  startAt,
  orderByChild,
  DataSnapshot,
  query,
  endAt,
  onValue,
} from "firebase/database";
import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { db } from "../../../../lib/firebase/firebase";
import styles from "./Search.module.css";

import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";

function titleCase(str: string) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
}

interface SearchResults {
  fullname: string;
  id: string | null;
  avatar?: string;
}

export const Search: React.FC = () => {
  const [value, setValue] = useState("~");
  const [searchArr, setSearchArr] = useState<SearchResults[]>([]);
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const debounced = useDebouncedCallback((value) => {
    setValue(value);
  }, 300);

  function handleChange(e: any) {
    if (e.target.value === "") {
      setValue("~");
    } else {
      debounced(titleCase(e.target.value));
    }
  }

  useEffect(() => {
    const referNav = query(
      ref(db, "/users"),
      orderByChild("fullname"),
      startAt(value),
      endAt(value + "~")
    );
    let searchRes: SearchResults[] = [];
    onValue(
      referNav,
      (snapshot: DataSnapshot) => {
        snapshot.forEach((childSnapshot) => {
          const results: SearchResults = {
            fullname: childSnapshot.val().fullname,
            id: childSnapshot.key,
            avatar: childSnapshot.val().avatar,
          };
          searchRes.push(results);
        });
        setSearchArr(searchRes);
        searchRes = [];
      },
      (err) => {
        console.log(err);
      }
    );
  }, [value]);

  return (
    <div >
      <button
        type="button"
        className="button"
        onClick={() => setOpen((o) => !o)}
      >
        Open Modal
      </button>
      <Popup className="searchDropdown" open={open} closeOnDocumentClick onClose={closeModal} position="right center">
          <div className="content">
            <input onChange={handleChange}></input>
            {searchArr.map((searchResult) => {
              return (
                <Link href={`/user/${searchResult.id}`} key={searchResult.id}>
                  <a
                    className={styles.searchNames}
                    onClick={() => setOpen(false)}
                  >
                    <img
                      src={
                        searchResult.avatar
                          ? searchResult.avatar
                          : "https://res.cloudinary.com/nucat/image/upload/v1641135095/wallpaper-for-facebook-profile-photo_bh9nxd.jpg"
                      }
                      className={styles.avatar}
                    ></img>
                    <p>{searchResult.fullname}</p>
                  </a>
                </Link>
              );
            })}
          </div>
          <div className="actions"></div>
      </Popup>
      <div className={styles.navbarItem}></div>
    </div>
  );
};
