const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

morgan.token("body", (req) => {
  if (req.method === "POST") return JSON.stringify(req.body)});

app.use(express.json());
app.use(express.static("build"));
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get("/api/persons", (req, res) => {
  res.json(persons);
})

app.get("/api/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`
  )
})

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  const person = persons.find(p => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
})

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  persons = persons.filter(p => p.id !== id);
  res.status(204).end();
})

const generateId = () => {
  const rangeUpperLimit = 10000;
  const currentIds = persons.map(p => p.id);

  let newId = Math.floor(1 + Math.random() * rangeUpperLimit);

  while (currentIds.includes(newId)) {
    newId = Math.floor(1 + Math.random() * rangeUpperLimit);
  }
  
  return newId;
}

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "content missing" });
  }
  if (persons.map(p => p.name).includes(body.name)) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person);
  res.json(person);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));