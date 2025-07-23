import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoShield from '../assets/TextGuard_logo_2.png';
import type { NavItem } from '../types/Nav';

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
];

const NavBar: React.FC = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(o => !o);
  const close = () => setOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={close}>
          <img
            src={logoShield}
            alt="TextGuard logo"
            height={30}
            className="d-inline-block align-text-top me-2"
          />
          <span>TextGuard</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navMenu"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={toggle}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse${open ? ' show' : ''}`} id="navMenu">
          <ul className="navbar-nav ms-auto">
            {NAV_ITEMS.map(({ to, label }) => (
              <li className="nav-item text-end" key={to}>
                <Link
                  className={`nav-link${pathname === to ? ' active' : ''}`}
                  to={to}
                  onClick={close}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
