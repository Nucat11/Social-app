import React from "react";
import {SignOutButton} from '../SignOutButton';
import { CreatePostForm } from "../Forms/CreatePostForm/CreatePostForm";

export const Newsfeed: React.FC = () => {
    return <div>
        <h1> Tablica</h1>
        <CreatePostForm/>
        <SignOutButton/>
        </div>
        
}