import { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { SignOutButton } from '../../SignOutButton';
import ThemeChanger from '../../ThemeChanger/ThemeChanger';
import styles from './NavbarDropdown.module.css'

export const NavbarDropdown: React.FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <Popup
    // onOpen={setOpen(true)}
    className='arrowPopup'
    closeOnDocumentClick 
      trigger={
        <img
          className={styles.arrowTrigger}
          src={
            'https://res.cloudinary.com/nucat/image/upload/v1642266833/arrow-right_gpmrn1.png'
          }
        />
      }
      position="bottom right"
    >
      <SignOutButton />
      <ThemeChanger/>
    </Popup>

  )
}
