'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const LinksList = props => {
  const links = props.authenticated
    ? [{
      title: 'Wishes',
      url: '/wishes'
    },
    {
      title: 'Logout',
      url: '/logout'
    }]
    : [{
      title: 'Login',
      url: '/login'
    }];

  const linksItems = links.map((link) => {
    return (
      <li key={link.title} className="nav-item"><Link className="nav-link" to={link.url}>{link.title}</Link></li>
    );
  });

  return (
    <ul className="navbar-nav mr-auto">
      {linksItems}
    </ul>
  );
};
LinksList.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

const Header = props => {
  return (
    <header className="navbar-light bg-faded">
      <nav className="container navbar navbar-toggleable-md">
        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <a className="navbar-brand" href="#">Feathershuttles</a>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <LinksList authenticated={props.authenticated} />
        </div>
      </nav>
    </header>
  );
};
Header.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

export default Header;
