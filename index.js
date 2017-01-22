const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');

const templateIndex = require('./templates/index');

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static('public'));

const state = {
  parts: [],
  nextId: 0,
};

app.get('/', (req, res) => {
  res.send(templateIndex({
    state,
  }));
});

app.post('/part', (req, res) => {
  state.parts.push({
    id: state.nextId,
    type: null,
    string: '',
  });

  state.nextId += 1;

  res.redirect('/');
});

app.put('/api/part', (req, res) => {
  state.parts.push({
    id: state.nextId,
    type: null,
    string: '',
  });

  state.nextId += 1;

  res.json(true);
});

app.post('/part/:id', (req, res) => {
  const method = req.body.method;
  const id = parseInt(req.params.id, 10);

  switch (method) {
    case 'save': {
      const existingPartIndex = state.parts.findIndex(part => part.id === id);
      state.parts[existingPartIndex] = {
        id,
        type: req.body.type,
        string: req.body.string,
      };
      break;
    }
    case 'delete':
      state.parts = state.parts.filter(part => part.id !== id);
      break;
    default:
      break;
  }

  res.redirect('/');
});

app.post('/api/part/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existingPartIndex = state.parts.findIndex(part => part.id === id);
  state.parts[existingPartIndex] = {
    id,
    type: req.body.type,
    string: req.body.string,
  };

  res.json(true);
});

app.delete('/api/part/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  state.parts = state.parts.filter(part => part.id !== id);

  res.json(true);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Kleene listening on port ${process.env.PORT || 3000}`);
});

