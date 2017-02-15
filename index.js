const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');

const StateServer = require('./public/js/models/state-server');

const layoutPage = require('./public/js/layout/page');
const templateHome = require('./public/js/templates/home');
const templateTimers = require('./public/js/templates/timers');

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static('public'));

// TODO: router

const state = new StateServer({
  routes: [{
    id: 'home',
    title: 'Home',
    path: '/home',
    current: true,
    params: {},
  }, {
    id: 'timers',
    title: 'Timers',
    path: '/timers',
    params: {},
  }],
});

app.get(['/', '/home', '/home/:id'], (req, res) => {
  state.changeRoute({
    id: 'home',
    params: req.params,
  });

  const content = templateHome({
    state: state.toObject(),
  });

  const page = layoutPage({
    state,
    title: 'Chrono - Home',
    content,
  });

  res.send(page);
});

app.get('/timers', (req, res) => {
  state.changeRoute({
    id: 'timers',
  });

  const content = templateTimers({
    state: state.toObject(),
  });

  const page = layoutPage({
    state,
    title: 'Chrono - Timers',
    content,
  });

  res.send(page);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Chrono listening on port ${process.env.PORT || 3000}`);
});

