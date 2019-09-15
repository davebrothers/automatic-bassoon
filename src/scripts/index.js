const XhrManager = require("./xhr-manager");

const xhr = new XhrManager();

xhr.getShowProgress("https://localhost:8000/foo.json", "load-spinner")
  .then(r => console.log(r))
  .catch(err => console.log(err));

xhr.getShowProgress("http://localhost:8000/foo.json", "load-spinner2")
  .then(r => console.log(r))
  .catch(err => console.log(err));
