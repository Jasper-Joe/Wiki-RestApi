const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app.get("/", function (req, res) {
  res.send("Welcom to Wiki App");
});

app.get("/articles", function (req, res) {
  Article.find(function (err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
});

app.put("/articles/:name", function (req, res) {
  Article.update(
    { title: req.params.name },
    { title: req.body.title, content: req.body.content },
    function (err, article) {
      if (!err) {
        res.send(article);
      } else {
        res.send(err);
      }
    }
  );
});

app.delete("/articles/:name", function (req, res) {
  Article.findOneAndDelete({ title: req.params.name }, function (err) {
    if (!err) {
      res.send("deleted");
    } else {
      res.send(err);
    }
  });
});

app.patch("/articles/:name", function (req, res) {
  Article.update(
    { title: req.params.name },
    { $set: req.body },
    function (err) {
      if (!err) {
        res.send("success!");
      } else {
        res.send(err);
      }
    }
  );
});

// url with parameters
app.get("/articles/:name", function (req, res) {
  var name = req.params.name;
  Article.findOne({ title: name }, function (err, article) {
    if (!err) {
      res.send(article);
    } else {
      res.send(err);
    }
  });
});

app.delete("/articles", function (req, res) {
  Article.deleteMany(function (err) {
    if (!err) {
      res.send("All deleted");
    } else {
      res.send(err);
    }
  });
});

app.post("/articles", function (req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
  });
  newArticle.save(function (err) {
    if (!err) {
      res.send(newArticle);
    } else {
      res.send(err);
    }
  });
});

mongoose.connect("mongodb://localhost:27018/wikiDB", { useNewUrlParser: true });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
