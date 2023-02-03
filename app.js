const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/data.js")

let items = ["Buy Food", "Cook Food", "Eat Food"];
let work = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));



app.get("/", function(req, res){
   
    let todaysDate = date.getDate();

    res.render("list", {listTitle: todaysDate, listItems: items});
});

app.post("/", function(req, res){

    if( req.body.list === "Work"){
        let item = req.body.newItem
        work.push(item);
        res.redirect("/work");
    }else{
        let item = req.body.newItem
        items.push(item);
        res.redirect("/");
    }
    
});

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work", listItems: work})
})

app.post("/work", function(req, res){
    
})

app.get("/about", function(req, res){
    res.render("about");
}
)

app.listen(3000, function(){
    console.log("Server is on port 3000");
})