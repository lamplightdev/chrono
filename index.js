const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');

const templateIndex = require('./templates/index');
const Part = require('./public/js/models/part');
const Parts = require('./public/js/models/parts');

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static('public'));

// TODO: use universal state mechanism

const state = {
  parts: new Parts(),
};

app.get('/', (req, res) => {
  res.send(templateIndex({
    state,
  }));
});

app.post('/part', (req, res) => {
  state.parts.addPart(new Part());

  res.redirect('/');
});

app.put('/api/part', (req, res) => {
  state.parts.addPart(new Part());

  res.json(true);
});

app.post('/part/:id', (req, res) => {
  const method = req.body.method;
  const id = parseInt(req.params.id, 10);

  switch (method) {
    case 'save': {
      state.parts.savePart(new Part(
        id,
        req.body.type,
        req.body.string
      ));
      break;
    }
    case 'delete':
      state.parts.deletePart(id);
      break;
    default:
      break;
  }

  res.redirect('/');
});

app.post('/api/part/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  state.parts.savePart(new Part(
    id,
    req.body.type,
    req.body.string
  ));

  res.json(true);
});

app.delete('/api/part/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  state.parts.deletePart(id);

  res.json(true);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Kleene listening on port ${process.env.PORT || 3000}`);
});

