import { getAuth, signOut } from "firebase/auth";
import {auth} from '../pages/api/firebase/firebase'

const SignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
}

export const SignOutButton:React.FC = () => {
    return(
        <button onClick={SignOut}>Wyloguj</button>
    )
}
