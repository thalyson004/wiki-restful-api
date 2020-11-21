const parser = require("body-parser");
const express = require("express");
//const ejs = require("ejs");
const mongoose = require("mongoose");
const secrets = require(__dirname+"/secrets.js");

const port = 3000;

//Connect to DB
mongoose.connect("mongodb+srv://"+secrets.user+":"+secrets.password+"@"+secrets.cluster+"/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });
//Create a schema
const articleSchema = new mongoose.Schema({
	title: String,
	content: String
});
//Create a model (something to access the db)
const Article = new mongoose.model("Article", articleSchema);
//Create a object Article
const article = new Article({title:"test", content:"Test"});
//article.save();

const app = express();
app.use(parser.urlencoded({extended:true}));
app.use(express.static("public"));


app.listen(port, ()=>{
	console.log("Everything is ok.");
});

//app.route("/articles").get().post().delete();
app.route("/articles")
	.get((req, res)=>{
		Article.find({}, (err, result)=>{
			if(!err){
				res.send(result);
			}else{
				res.send(err);
			}
		});
	})

	.post((req, res)=>{
		const newArticle = new Article({title:req.body.title, content:req.body.content});
		newArticle.save((err)=>{
			if(err){
				res.send(err);
			}else{
				res.send("200");
			}
		});
	})

	.delete((req, res)=>{
		Article.deleteMany({}, (err)=>{
			if(err){
				res.send(err);
			}else{
				res.send("200");
			}
		});
	});


//app.route("/article/:articleTitle").get().put().patch().delete();
app.route("/articles/:articleTitle")
.get((req, res)=>{
	title = req.params.articleTitle;
	Article.find({title:title}, (err, result)=>{
		if(!err){
			res.send(result);
		}else{
			res.send(err);
		}
	});
})
.put((req, res)=>{
	title = req.params.articleTitle;
	Article.update(
		{title:title},
		{title:req.body.title, content:req.body.content},
		{overwrite:true},
		(err)=>{
		if(!err){
			res.send("200");
		}else{
			res.send(err);
		}
	});
})
.patch((req, res)=>{
	title = req.params.articleTitle;
	Article.updateOne(
		{title:title},
		{$set: req.body},
		(err)=>{
		if(!err){
			res.send("200");
		}else{
			res.send(err);
		}
	});
})
.delete((req, res)=>{
	title = req.params.articleTitle;
	Article.deleteOne(
		{title:title},
		(err)=>{
		if(!err){
			res.send("200");
		}else{
			res.send(err);
		}
	});
});
