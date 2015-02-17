var fs = require("fs");
var markov = require("markov");
var express = require("express");
var mustacheExpress = require('mustache-express');

var chain = markov(1);

var app = express();

var PORT = process.env.GLORIOUS_PORT || 8082;

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

function getSource () {
  return fs.createReadStream(__dirname + "/training-data.txt");
}

function perfectWorldify () {
  var text = chain.respond("let").reverse();
  text[0] = text[0].charAt(0).toUpperCase() + text[0].slice(1);
  return text.join(" ");
}

function getBg (limit) {
  return Math.round(Math.random() * limit) + 1;
}

console.log("Training chain");
chain.seed(getSource(), function () {
  app.use("/assets", express.static(__dirname + "/assets"));

  app.get("/", function (req, res) {
    var slogan = perfectWorldify();
    var bg = getBg(5);

    res.render("index", {
      slogan: slogan,
      bg: bg
    });
  });

  app.get("/slogan", function (req, res) {
    var slogan = perfectWorldify();
    res.send(slogan);
  });

  app.listen(PORT, function (err) {
    if (err) return console.error(err);

    console.log("Listening on", PORT);
  });
});

