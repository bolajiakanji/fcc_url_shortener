const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

mongoose
  .connect(
    "mongodb+srv://bolajiakanji21:Unde5085%402@bolaji.l6yuhxc.mongodb.net/fcc-urlShortener?retryWrites=true&w=majority&appName=Bolaji"
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
    require: true,
  },
});

const UrlModel = mongoose.model("url", urlSchema);

app.use(cors({ optionSuccessStatus: 200 }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  return res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  return res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  console.log(req.body.url + 'first')
  console.log(req.body.url.replace(/https:\/\/|http:\/\//, ""))
  let dnsregex = req.body.url.replace(/https:\/\/|http:\/\/(.+?)\/.*/,'$1')
  console.log(dnsregex)
  dns.lookup(dnsregex
    ,
  
    (err, address, family) => {
      if (err) {
        console.log('here 6')
        
        return res.json({ error: "invalid URL" });
      }
      console.log(req.body.url + 'bode.url1')
      UrlModel.find().then((data) => {
        
        new UrlModel({
          id: parseInt(data.length + 1),
          url: req.body.url,
        })
          .save()
          .then((savedData) => {
            console.log(savedData.url + 'saveddata1')
           console.log(res.json({
              original_url: savedData.url,
              short_url: savedData.id,
            }));
          })
          .catch((err) => {
             res.json(err);
          });
      });
    }
  );
});
app.get("/api/shorturl/:short_url",async function (req, res) {
  if (req.params.short_url) {
    console.log(req.params.short_url +'mine' );

    const _number = parseInt(req.params.short_url);
    console.log(_number + '_number 1');
    if (_number) {
      try {
        const ddata = await UrlModel.find({ id: _number });
        console.log(ddata);

        return res.redirect(ddata[0]["url"]);
      } catch (err) {
        res.send(err);
      }
    }

    //   const _number = parseInt(req.params.short);
    //   if (_number) {
    //   console.log("the type of number is" + typeof _number);
    //   UrlModel.find({ id: _number }).then((url) => {
    //     console.log(url);
    //     return res.redirect(url[0]["url"]);
    //   });
    //   } else {
    //     res.send('invalid rout')
    //     return;
    // }} else {
    //   res.send('invalid route')
    //   return;
    // }
  } else {
    res.json({ invalid: route });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
