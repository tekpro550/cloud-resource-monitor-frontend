import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <h1>Cloud Resource Monitor</h1>
      <nav>
        <Link to="/">Dashboard</Link>
      </nav>
    </header>
  );
};

export default Header;
