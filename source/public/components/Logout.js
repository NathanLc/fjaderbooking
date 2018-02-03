'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import app from '../app';

class Logout extends React.Component {
  constructor () {
    super();
    this.state = {
      isLoading: true,
      authenticated: true
    };
  }

  componentDidMount () {
    app.logout()
      .then(() => {
        this.setState({
          isLoading: false,
          authenticated: false
        });
        this.props.onAuthentication(false);
      });
  }

  render () {
    return this.state.isLoading
      ? (<div>Logging out...</div>)
      : (
        <Redirect to={{
          pathname: '/',
          state: { from: this.props.location }
        }} />
      );
  }
};
Logout.propTypes = {
  onAuthentication: PropTypes.func.isRequired
};

export default Logout;
