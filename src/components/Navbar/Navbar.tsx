import Link from 'next/link'
import React, { useContext, useState } from 'react'
import { AuthContext, ContextState } from '../AuthContext/AuthContext'
import { SignOutButton } from '../SignOutButton'
import { HomeIcon } from './HomeIcon'
import styles from './Navbar.module.css'
import { Search } from './Search/Search'
import { useRouter } from 'next/router'
import { NavbarDropdown } from './NavbarDropdown/NavbarDropdown'

export const Navbar: React.FC = () => {
  const { user } = useContext(AuthContext) as ContextState
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      {user ? (
        <div className={styles.navbar}>
          <Search user={user.uid} />
          <div style={{ flexGrow: 1 }}></div>
          <Link href="/">
            <div
              className={
                styles.homeButton +
                ' ' +
                (router.pathname == '/'
                  ? styles.homeButtonActive
                  : styles.homeButtonDisabled)
              }
            >
              <HomeIcon />
            </div>
          </Link>

          <Link href="/profile" passHref>
            <div
              className={
                styles.homeButton +
                ' ' +
                (router.pathname == '/profile'
                  ? styles.homeButtonActive
                  : styles.homeButtonDisabled)
              }
            >
              Profile
            </div>
          </Link>
          <NavbarDropdown />
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
