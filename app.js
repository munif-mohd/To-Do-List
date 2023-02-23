const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
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
                    console.log("Sucessfully data added");
                    res.redirect("/");
                }
            })
    }else{
        console.log("No Data added!");
        res.render("list", {listTitle: "Today", itemsList: items});
    }
}) 
});

app.post("/", function(req, res){

    if( req.body.list === "Work"){
        let item = req.body.newItem
        work.push(item);
        res.redirect("/work");
    }else{
        let itemName = req.body.newItem;
        const newItem = new Item ({
            name: itemName
        })
        newItem.save();
      //  items.push(item);
        res.redirect("/");
    }
    
});

app.post("/delete", function(req, res){
    console.log(req.body.checkBox);
    Item.findByIdAndRemove(req.body.checkBox, function(err){
        if(!err){
            res.redirect("/");
        }else{
            console.log(err);
        }
    })
    //Item.deleteOne({_id: req.body.checkBox});
    //Item.deleteById(req.body.checkBox);
    
})

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