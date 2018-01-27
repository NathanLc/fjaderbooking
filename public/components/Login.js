'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import app from '../app';

const LoginComponent = props => (
    <form className="form" onSubmit={props.onSubmitLogin}>
      <input type="email" name="email" placeholder="email" value={props.email} onChange={props.onUpdateEmail} />
      <input type="password" name="password" value={props.password} onChange={props.onUpdatePassword} />
      <input type="submit" />
    </form>
);
LoginComponent.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onSubmitLogin: PropTypes.func.isRequired,
  onUpdateEmail: PropTypes.func.isRequired,
  onUpdatePassword: PropTypes.func.isRequired
};

class Login extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      authenticated: false
    };

    this.handleUpdateEmail = this.handleUpdateEmail.bind(this);
    this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
    this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
  }

  handleUpdateEmail (e) {
    this.setState({
      email: e.target.value
    });
  }

  handleUpdatePassword (e) {
    this.setState({
      password: e.target.value
    });
  }

  handleSubmitLogin (e) {
    e.preventDefault();

    app.authenticate({
      strategy: 'local',
      email: this.state.email,
      password: this.state.password
    })
    .then(() => {
      this.setState({
        authenticated: true
      });
      this.props.onAuthentication(true);
    })
    .catch(() => {
      this.props.onAuthentication(false);
    });
  }

  render () {
    return this.state.authenticated
      ? (
        <Redirect to={{pathname: '/wishes'}} />
      ) : (
        <LoginComponent
          email={this.state.email}
          password={this.state.password}
          onUpdateEmail={this.handleUpdateEmail}
          onUpdatePassword={this.handleUpdatePassword}
          onSubmitLogin={this.handleSubmitLogin} />
      );
  }
};
Login.propTypes = {
  onAuthentication: PropTypes.func.isRequired
};

export default Login;
