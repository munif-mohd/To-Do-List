const express = require("express");
const bodyParser = require("body-parser");
const app = express();

let items = ["Buy Food", "Cook Food", "Eat Food"];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));



app.get("/", function(req, res){
   
    let today = new Date;
    let options = {
        weekday: "long",
        month:  "long",
        day: "numeric"
    };

    let todaysDate = today.toLocaleDateString("en-US", options);
 

    res.render("list", {KindOfDay: todaysDate, listItems: items});
});

app.post("/", function(req, res){

    let item = req.body.newItem
    items.push(item);
    console.log(items);

    res.redirect("/");
});



app.listen(3000, function(){
    console.log("Server is on port 3000");
})