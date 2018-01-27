'use strict';

import feathers from 'feathers/client';
import socketio from 'feathers-socketio/client';
import hooks from 'feathers-hooks';
import authentication from 'feathers-authentication-client';
import io from 'socket.io-client';

const socket = io('http://localhost:3030');
const app = feathers()
  .configure(socketio(socket))
  .configure(hooks())
  .configure(authentication({ storage: window.localStorage }));

export default app;
