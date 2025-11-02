import './Layout.scss';

import { FC, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface Props {
  content: ReactNode;
}

const Layout: FC<Props> = ({ content }) => {
  return (
    <>
      <nav>
        <NavLink to="/synthese" className={({ isActive }) => (isActive ? 'selected' : '')}>
          Synthèse
        </NavLink>
        <NavLink to="/" className={({ isActive }) => (isActive ? 'selected' : '')}>
          Extraits
        </NavLink>
        <NavLink to="/previsions" className={({ isActive }) => (isActive ? 'selected' : '')}>
          Prévisions
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => (isActive ? 'selected' : '')}>
          Categories
        </NavLink>
        <NavLink to="/configuration" className={({ isActive }) => (isActive ? 'selected right' : 'right')}>
          Configuration
        </NavLink>
      </nav>
      <div className="tab-content">{content}</div>
    </>
  );
};

export default Layout;
