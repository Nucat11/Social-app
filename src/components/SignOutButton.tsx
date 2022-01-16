import { getAuth, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase/firebase";
import CustomButton from "./ReusableComponents/CustomButton/CustomButton";

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
  return <CustomButton onClick={SignOut} border="none" color="transparent" height="40px" radius="0" width="100px">Wyloguj</CustomButton>;
};
