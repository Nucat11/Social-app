import Link from "next/link";
import React, { useContext } from "react";
import { AuthContext, ContextState } from "../AuthContext/AuthContext";
import { SignOutButton } from "../SignOutButton";
import styles from './Navbar.module.css'
import { Search } from "./Search/Search";

export const Navbar: React.FC = () => {
    const { user } = useContext(AuthContext) as ContextState;
    return (<>{user ? <div className={styles.navbar}>
        <SignOutButton/>
        <Link href="/profile">Profile</Link>
        <Search user={user.uid}/>
    </div> : <></>}</>)
}