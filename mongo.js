const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@coursecluster-8qkj7.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model("Person", personSchema);

if (name && number) {
  const person = new Person({ name, number });
  person.save().then(result => {
    console.log("save result", result);
    mongoose.connection.close();
  });
} else {
  console.log("phonebook:");
  Person.find({}).then(result => {
    result.forEach(p => console.log(`${p.name} ${p.number}`));
    mongoose.connection.close();
  });
}
