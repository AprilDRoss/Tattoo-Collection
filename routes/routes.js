const express = require("express");
const router = express.Router();
const mongo = require('mongo');
const mongoose = require("mongoose");
//create mongoose schema
const Schema = mongoose.Schema;

mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://localhost:27017/tattoos");

//creating Schema
const tattooCollection = new Schema({
  name: { type: String, required: true, unique: true },
  theme: {type: String, required:true},
  elements: [{
	           primarycolor:String,
	           addedeffects:String,
	           text:String,
             }]
});

//create a model instance by using a mongoose method
const Piece = mongoose.model("Ink", tattooCollection);

router.get("/", function(req, res){
  Piece.find({}).then(function(allTattoos){
    res.render("index",{allTattoos:allTattoos});
  });
});

router.post("/", function(req, res){
  //like creating a row in a table
  let inked  = new Piece({
    name: req.body.tattooname,
    theme:req.body.tattootheme,
    elements:req.body.tattooelements,
  });
  inked.elements.push({primarycolor: req.body.primarycolor, addedeffects:req.body.addedeffects, text:req.body.text});
    inked.save().then(function(newInk){
    res.redirect("/");
  });
  // .catch(function(err){
  //   res.send("Errors");
  // });

});
//*******need to fix the edit***********
router.get("/edit/:name", function(req, res){
  Piece.findOne({name:req.params.name}).then(function(oneTattoo){
    res.render("edit",{oneTattoo:oneTattoo});
  });
});

router.post("/edit/:name", function(req, res){
  Piece.updateOne({name:req.params.name},
    {theme: req.body.theme,
      'type.0':{
      primarycolor: req.body.primarycolor,
      addedeffects: req.body.addedeffects,
      text: req.body.text}}).then(function(inked){
    res.redirect("/");
});
});
//***********************************************
router.post("/name/delete", function(req, res){
  Piece.deleteOne({name:req.params.name}).then(function(allTattoos){
    res.redirect("/");
  })
});



module.exports = router;
