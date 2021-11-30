const express = require("express")
const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const _ = require("lodash")
const app = express();




app.set('view engine', 'ejs');



app.use(bodyparser.urlencoded({ extended: true }))

app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todolistdb', { useNewUrlParser: true });

const itemSchema = new mongoose.Schema({
    name: String
})

const itemmodel = mongoose.model("Item", itemSchema);

const item1 = new itemmodel({
    name: "Welcome to do you todolist"
})

const item2 = new itemmodel({
    name: "Hit the + button to add new item"
})

const item3 = new itemmodel({
    name: "<-Hit this to delete an item"
})


const listSchema=new mongoose.Schema({
    name:String,
    items:[itemSchema]
})

const List=mongoose.model("List",listSchema)



const defaultitems = [];




app.get("/", (req, res) => {
    var today = new Date();




    itemmodel.find({}, function (err, docs) {

        // if (docs.length === 0) {

        //     itemmodel.insertMany(defaultitems, function (err) {
        //         if (err)
        //             console.log(err)
        //         else
        //             console.log("items added")
        //     })
        //     res.redirect("/")
        // }
        // else
        res.render('list', { listtitle: "MainList", newlist: docs });
    })

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today = new Date();

    var day = (today.toLocaleDateString("en-US", options))

    //     if(current_today==0) 
    //     {day="Sunday"
    //     res.render('list', {kindofday: day});
    //      }

    //      if(current_today==1)
    //     {day="Monday"
    //     res.render('list', {kindofday: day});
    // }

    // if(current_today==2)
    // {day="Tuesday"
    // res.render('list', {kindofday: day});
    // }

    //  if(current_today==3)
    // {day="Wednesday"
    // res.render('list', {kindofday: day});
    // }

    //  if(current_today==4)
    // {day="Thursday"
    // res.render('list', {kindofday: day});
    // }

    //  if(current_today==5)
    // {day="Friday"
    // res.render('list', {kindofday: day});
    // }

    //  if(current_today==6)
    // {day="Saturday"


})

app.post("/", (req, res) => {
    console.log(req.body);

    const itemname = (req.body.addwork)
    const listname=req.body.list;

    const item=new itemmodel({
        name:itemname
    })
  

    if(listname==="MainList")
    {
        item.save();

        res.redirect("/")
    }
    else{

      List.findOne({name:listname},function(err,foundlist){
        foundlist.items.push(item);
        foundlist.save();
          res.redirect("/"+ listname)
      })

    }

   

    // if (req.body.button === "Work") {
    //     workarray.push(item)
    //     res.redirect("/work")
    // }
    // else {
    //     itemarray.push(item)
    //     res.redirect("/")
    // }
})

app.post("/delete",(req,res)=>{

    console.log(req.body.checkbox)

const checkitemid=(req.body.checkbox)
const listName=req.body.listName;

if(listName==="MainList")
{
    itemmodel.findByIdAndRemove(checkitemid, function(err){
        if(err)
        console.log(err)
        else
        {console.log("item removed")
        res.redirect("/")}
    })
}else{
    List.findOneAndUpdate({name:listName},{ $pull:{items:{_id:checkitemid}}},function(err,foundlist){
        if(!err)
        {
            res.redirect("/"+listName)
        }
    })
    
}



})


app.get("/:customlistname", (req, res) => {

   const customlistname=_.capitalize(req.params.customlistname);
    

    List.findOne({ name: customlistname }, function (err, foundlist) {
      if(!err)
      {
          if(!foundlist)
          {
            const listdoc=new List({
                name:customlistname,
                items:defaultitems
            })
            listdoc.save()
            res.redirect("/" + customlistname)
          }
          else
          {
            res.render('list', { listtitle: foundlist.name, newlist: foundlist.items });
          }
      }
    });



})//dynamic router

app.get("/about", (req, res) => {
    res.render('about')
})


app.listen(3000, () => {
    console.log("server run sucessfully");
})