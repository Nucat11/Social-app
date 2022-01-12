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
import { db } from "../../../../lib/firebase/firebase";
import styles from "./Search.module.css";
import ClickAwayListener from "react-click-away-listener";
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
interface Props {
  user: string;
}

export const Search = ({ user }: Props) => {
  const [value, setValue] = useState("~");
  const [searchArr, setSearchArr] = useState<SearchResults[]>([]);
  const [open, setOpen] = useState(false);
  const debounced = useDebouncedCallback((value) => {
    setValue(value);
  }, 300);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
  function handleClickAway(e: any) {
    setTimeout(() => {
      setOpen(false);

    },100)
    setValue("~");
    if(document.querySelector("input")) {
      document.querySelector("input")!.value = ""
    };
  }
  return (
    <div>
        <ClickAwayListener onClickAway={handleClickAway}>
      <div className={open === true ? styles.returnBox : styles.returnBoxBlur}>
          <input onChange={handleChange} className={styles.searchInput} onFocus={() => { setOpen(true); }} placeholder="Search for friend..."></input>
        {searchArr.map((searchResult) => {
          if (searchResult.id === user) {
            return (
              <Link href="/profile" key={searchResult.id}>
                <a
                  className={styles.searchNames}
                  onClick={handleClickAway}
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
          } else {
            return (
              <Link href={`/user/${searchResult.id}`} key={searchResult.id}>
                <a
                  className={styles.searchNames}
                  onClick={handleClickAway}
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
          }
        })}
      </div>
        </ClickAwayListener>
    </div>
  );
};
