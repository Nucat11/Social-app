import { getAuth, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase/firebase";
import CustomButton from "./CustomButton/CustomButton";

const SignOut = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
};

export const SignOutButton: React.FC = () => {
  return <CustomButton onClick={SignOut} border="none" color="blue" height="100px" radius="0" width="100px">Wyloguj</CustomButton>;
};
