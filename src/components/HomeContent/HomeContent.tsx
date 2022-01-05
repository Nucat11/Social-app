import * as React from "react";
import Copyright from "../Copyright";
import { LoginAndRegister } from "../Forms/LoginAndRegister/LoginAndRegister";
import { AuthContext } from "../AuthContext/AuthContext";
import { useContext } from "react";
import { ContextState } from "../AuthContext/AuthContext";
import { Newsfeed } from "./NewsFeed/NewsFeed";
import ThemeChanger from "../ThemeChanger/ThemeChanger";
import styles from "./HomeContent.module.css";
import { LoRProvider } from "./LoginOrRegisterContext/LoRContext";

const HomeContent: React.FC = () => {
  const { user } = useContext(AuthContext) as ContextState;
  
  return (
    <>
      <div>
        <LoRProvider>
          {!user ? (
            <div className={styles.mainPage}>
              <LoginAndRegister />
              <img
                className={styles.imageBackground}
                src="https://res.cloudinary.com/nucat/image/upload/c_crop,h_224,w_1080,y_424/v1640623487/Bez_tytu%C5%82u_jrviin.png"
              ></img><ThemeChanger /><Copyright />
            </div>
          ) : (
            <div className={styles.newsFeed}><Newsfeed /><ThemeChanger /><Copyright /></div>
          )}
          
          
        </LoRProvider>
      </div>
    </>
  );
};

export default HomeContent;
