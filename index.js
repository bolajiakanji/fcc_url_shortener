
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");



// Basic Configuration
const port = process.env.PORT || 3000;

mongoose
  .connect("mongodb+srv://bolajiakanji21:Unde5085%402@bolaji.l6yuhxc.mongodb.net/urlShortener?retryWrites=true&w=majority&appName=Bolaji"
  )
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.error("could not connect to mongodb"));

var urlSchema = new mongoose.Schema({
  id: {
    type: Number,
    require: true,
  },
  url: {
    type: String,
    require:true,
  },
});

const UrlModel = mongoose.model("url", urlSchema);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  dns.lookup(req.body.url, (err, address, family) => {
    if (err) {
      res.json({ error: "invalid URL" });
    } else {
      UrlModel.find().then((data) => {
        new UrlModel({
          id: parseInt(data.length + 1),
          url: req.body.url,
        })
          .save()
          .then(() => {
            res.json({
              original_url: req.body.url,
              short_url: data.length + 1,
            });
          })
          .catch((err) => {
            res.json(err);
          });
      });
    }
  });
});

app.get("/api/shorturl/:number", function (req, res) {
  const _number = parseInt(req.params.number)
  console.log('the type of number is'+ typeof _number)
  UrlModel.find({ id: _number }).then((url) => {
    console.log(url)
    if (req.params.number) return res.redirect('https://'+url[0]['url'])
    res.send(null)
 
       
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
