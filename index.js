const express = require("express");
const morgan = require("morgan");

const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.use(morgan("tiny"));

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
];
console.log("persons =", persons);

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});
app.get("/api/persons", (request, response) => {
  response.json(persons);
});
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});
app.get("/info", (request, response) => {
  response.send(
    `<div>
        <div>Phonebook has info for ${persons.length} people</div>
        <br/>
        <div>${Date()}</div>
    </div>`
  );
});

const generateId = () => {
  return Math.floor(Math.random() * 100000);
};
app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response
      .status(400)
      .json({ error: "The name or number is missing" });
  }
  if (persons.map(p => p.name).includes(name)) {
    return response.status(409).json({ error: "name must be unique" });
  }
  const person = { name, number, id: generateId() };
  persons = persons.concat(person);
  response.json({ name, number });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
