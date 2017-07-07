const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
//create mongoose schema
const Schema = mongoose.Schema;

mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://localhost:27017/tattoos");

//creating Schema
const tattooCollection = new Schema({
  name: { type: String, required: true, unique: true },
  finished: Boolean,
  sessionsTime: Number,
  theme: {type: String, required:true},
  elements: [{
	           primarycolor:[String],
	           addedeffects:[String],
	           text:[String],
             }],
  sessionsRemaining: Number
});

//create a model by using a mongoose method
const Piece = mongoose.model("Tattoos", tattooCollection);

router.get("/", function(req, res){
  Piece.find({}).then(function(allTattoos){
    res.render("index",{allTattoos:allTattoos});
  });
});

router.post("/", function(req, res){
  //like creating a row in a table
  let inked  = new Piece({
    name: req.body.tattooname,
    finished:req.body.finished,
    sessionTime:req.body.sessionTime,
    theme:req.body.tattootheme,
    elements:req.body.tattooelements,
    sessionsRemaining:req.body.sessionsRemaining
  });
  inked.elements.push({primarycolor: req.body.primarycolor, addedeffects:req.body.addedeffects, text:req.body.text});
    inked.save().then(function(newInk){
    res.redirect("/");
  });
  // .catch(function(err){
  //   res.send("Errors");
  // });

});

module.exports = router;
