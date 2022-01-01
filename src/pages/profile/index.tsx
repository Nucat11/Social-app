import * as React from 'react';
import type { NextPage } from 'next';
import { ProfileComponent } from '../../components/ProfileComponent/ProfileCompontent';
import { AuthContext, ContextState } from '../../components/AuthContext/AuthContext';


const Profile: NextPage = () => {
  const { user } = React.useContext(AuthContext) as ContextState;

  if(user) {
    return <ProfileComponent/>
  }
  else {
    return <div></div>
  }

};

export default Profile;
