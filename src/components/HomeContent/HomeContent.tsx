import * as React from "react";
import Copyright from "../Copyright";
import { LoginAndRegister } from '../Forms/LoginAndRegister/LoginAndRegister';
import { AuthContext } from "../AuthContext/AuthContext";
import { useContext } from "react";
import { ContextState } from "../AuthContext/AuthContext";
import { Newsfeed } from "../NewsFeed/NewsFeed";
import ThemeChanger from "../ThemeChanger/ThemeChanger";
import styles from './HomeContent.module.css'

const HomeContent: React.FC = () => {
  const { user } = useContext(AuthContext) as ContextState;
  return (
    <div className={styles.mainPage}>
      {!user ? <LoginAndRegister />: <Newsfeed />}
      <ThemeChanger />
      <Copyright />
    </div>
  );
};

export default HomeContent;
