const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { get } = require("lodash");
const app = express(); 

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/toDoListDB",{
    useNewUrlParser: true,
    useUnifiedTopology: true
})


const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item ({
    name : "Welcome to our toDo List"
})

const item2 = new Item ({
    name : "Press + to add an item"
})

const item3 = new Item ({
    name : "Hope you enjoy your experence today!"
})

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    toDo: [itemSchema]
})

const List = mongoose.model("list", listSchema);

app.get("/", function(req, res){
    Item.find(function(err, items){
        if(err){
            console.log(err);
        }
        else if(items.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }else{
                    res.redirect("/");
                }
            })
    }else{
            res.render("list", {listTitle: "Today", itemsList: items});
    }
}) 
});

app.post("/", function(req, res){

    const listName = req.body.list;
    const itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name: listName}, function(err, foundItem){
            if(err){
                console.log(err);
            }else{
                foundItem.toDo.push(item);
                foundItem.save();
                res.redirect("/" + listName);
            }
        })
    }
});

app.post("/delete", function(req, res){
    Item.findByIdAndRemove(req.body.checkBox, function(err){
        if(!err){
            res.redirect("/");
        }else{
            console.log(err);
        }
    })
})


app.get("/:customListName", function(req, res){

    const customListName = req.params.customListName;

   

    List.findOne({name: customListName}, function(err, foundList){
        if(err){
            console.log(err);
        }else if(!foundList){
            const list = new List({
                name: customListName,
                toDo: defaultItems
            })
            list.save();
            res.redirect("/" +customListName);
        }else{
            res.render("list", {listTitle: customListName, itemsList: foundList.toDo});
        }
    })
})

app.listen(3000, function(){
    console.log("Server is on port 3000");
})