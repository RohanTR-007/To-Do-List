const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require('lodash')

var date = require(__dirname + '/date.js');
var app = express();

app.set("view engine", 'ejs');
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"))

mongoose.connect("mongodb+srv://rohan:qwerty6789@cluster0.gmf1ra9.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true });

const TopicSchema = new mongoose.Schema({
    title:
    {
        type: String,
        required: [true]
    }

});

const Topic = mongoose.model("Topic", TopicSchema);

const Item1 = new Topic({
    title: "Welcome to to do list app"
});
const Item2 = new Topic({
    title: "Press + to add a new item"
});
const Item3 = new Topic({
    title: "Add description along with that"
});

var defaultItems = [Item1, Item2, Item3]
let today = date();

app.get("/", (req, res, next) => {
    let today = date();
    Topic.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Topic.insertMany(defaultItems, function (err) {
                if (err)
                    console.log(err)
                else
                    console.log("Insertion sucessfull")
            })
            res.redirect("/")
        }
        else {
            res.render('list', { listTitle: today, listItems: foundItems })
        }
    });
})

app.post("/", (req, res, next) => {
    console.log(req.body)
    var itemName = req.body.newItem;
    var foundName = req.body.listTitle;
    console.log(foundName)
    if(foundName === today)
    {
        const newitem = new Topic({ title: itemName });
        newitem.save()
        res.redirect("/");
    }
    else
    {
        const newitem = new Topic({ title: itemName });
        List.findOne({name:foundName},(err,foundList)=>
        {
            if(!err)
            {
                foundList.items.push(newitem);
                console.log("inserted done")
                foundList.save();
                res.redirect("/"+foundName);
            }
            else{
                console.log(err);
            }
            

        })
    }
    
})

app.post("/delete", (req, res, next) => {
    console.log(req.body)
    const foundName = req.body.listName;
    const foundId = req.body.checkbox;
    if(foundName == today)
    {
        Topic.findByIdAndRemove(foundId, (err) => {
            if (!err) {
                console.log("Deleted sucessfully")
            }
        })
        res.redirect("/")
    }
    else
    {
        List.findOneAndUpdate({name:foundName},{$pull:{items:{_id:foundId}}},(err,result)=>
        {
            if(!err)
            {
                console.log(result);
            }
        })
        res.redirect("/"+foundName);
    }
    
    
    
});

const listSchema = new mongoose.Schema({
    name: String,
    items: [TopicSchema]

})

const List = mongoose.model("List", listSchema);

app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({ name: customListName }, (err, foundItems) => {
        if (!err) {
            if (foundItems === null) {
                const newList = new List({
                    name: customListName,
                    items: defaultItems
                })
                newList.save();
                res.redirect("/" + customListName)
            }
            else {
                res.render('List', { listTitle: foundItems.name, listItems: foundItems.items })

            }
        }
        else
        {
            console.log(err)
        }

    })

})

app.post("/:customListName", (req, res, next) => {
    // console.log(req.body)
    var itemName = req.body.newItem
    const item = new List({ name: itemName ,items:defaultItems});
    item.save()
    res.render('list',{});
})

app.listen(process.env.PORT||4000,()=>
{
    console.log("Server is running")
});


