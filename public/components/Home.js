'use strict';

import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const Home = props => {
  const path = props.authenticated ? '/wishes' : '/login';

  return (
    <Redirect to={{
      pathname: path,
      state: { from: props.location }
    }} />
  );
};
Home.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

export default Home;
