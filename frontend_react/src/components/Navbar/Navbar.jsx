import React from 'react'

import { images } from '../../constants';
import './Navbar.scss';

const Navbar = () => {
  return (
    <nav>
      <div>Navbar
        <img src={images.logo} alt="logo" />
      </div>
    </nav>
  )
}

export default Navbar;