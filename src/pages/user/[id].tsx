import { ProfileComponent } from "../../components/ProfileComponent/ProfileCompontent";
import { useRouter } from "next/router";
import React from "react";
import {
  AuthContext,
  ContextState,
} from "../../components/AuthContext/AuthContext";

const userProfile = () => {
  
  const { user } = React.useContext(AuthContext) as ContextState;
  const router = useRouter();
  let { id } = router.query;

  if (user && id) {
    id = id!.toString()
    return <ProfileComponent userID={id} />;
  } else {
    return <div></div>;
  }
  
};


export default userProfile;
