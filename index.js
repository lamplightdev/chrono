const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');

const StateServer = require('./public/js/models/state-server');
const VerEx = require('verbal-expressions');

const layoutPage = require('./public/js/layout/page');
const templateHome = require('./public/js/templates/home');
const templateAbout = require('./public/js/templates/about');
const templateTimers = require('./public/js/templates/timers');

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static('public'));

// TODO: router

const state = new StateServer();

const navItems = [{
  id: 'home',
  title: 'Home',
  path: '/',
}, {
  id: 'about',
  title: 'About',
  path: '/about',
}, {
  id: 'timers',
  title: 'Timers',
  path: '/timers',
}];

app.get('/', (req, res) => {
  state.changeRoute({
    id: 'home',
  });

  const content = templateHome({
    state: state.toObject(),
  });

  const page = layoutPage({
    state,
    title: 'Kleene - Home',
    content,
    navItems,
  });

  res.send(page);
});

app.get('/about', (req, res) => {
  state.changeRoute({
    id: 'about',
  });

  const content = templateAbout({
    state: state.toObject(),
    who: 'Mr NO JS',
  });

  const page = layoutPage({
    state,
    title: 'Kleene - About',
    content,
    navItems,
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
    title: 'Kleene - Timers',
    content,
    navItems,
  });

  res.send(page);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Kleene listening on port ${process.env.PORT || 3000}`);
});

