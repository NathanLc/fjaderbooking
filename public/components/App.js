'use strict';

import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Home from '../components/Home';
import Login from '../components/Login';
import Wishes from '../components/Wishes';
import Logout from '../components/Logout';
import app from '../app';

class App extends React.Component {
  constructor () {
    super();
    this.state = {
      authenticated: false
    };

    this.handleAuthentication = this.handleAuthentication.bind(this);
  }

  handleAuthentication (authenticated) {
    this.setState({
      authenticated: authenticated
    });
  }

  componentDidMount () {
    app.authenticate()
      .then(() => {
        this.handleAuthentication(true);
      })
      .catch(() => {
        this.handleAuthentication(false);
      });
  }

  render () {
    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route {...rest} render={props => (
        this.state.authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }} />
        )
      )} />
    );

    return (
      <Router>
        <div>
          <Header authenticated={this.state.authenticated} />
          <main className="container">
            <Route path="/login" render={() => (
              this.state.authenticated ? (
                <Redirect to={{pathname: '/wishes'}} />
              ) : (
                <Login onAuthentication={this.handleAuthentication} />
              )
            )} />
            <Route path="/logout" render={() => (
              this.state.authenticated ? (
                <Logout onAuthentication={this.handleAuthentication} />
              ) : (
                <Redirect to={{pathname: '/wishes'}} />
              )
            )} />
            <PrivateRoute path="/wishes" component={Wishes} />
          </main>
        </div>
      </Router>
    );
  }
};

export default App;
