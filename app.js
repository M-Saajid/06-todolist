//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { redirect } = require("express/lib/response");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-sk:0759342494@cluster0.jqida.mongodb.net/to-do-Listdb");
const itemSchema = {
	name: String
}
const listSchema={
	name:String,
	items:[itemSchema]
}
const List = mongoose.model("List", listSchema);
const Item = mongoose.model("Item", itemSchema)

const item1 = new Item({
	name: "Welcome to to-do List "
})
const item2 = new Item({
	name: "Start your routing "
})
const item3 = new Item({
	name: "Click + to add list  "
})
const item4 = new Item({
	name: "Sdd your list  "
})
const defaultItems = [item1, item2, item3, item4]

app.get("/", function (req, res) {

	Item.find({}, function (err, foundItems) {
		if (foundItems.length === 0) {
			Item.insertMany(defaultItems, (e) => {
				if (e) {
					console.log(e)
				} else {
					console.log("Succcss you have added the Item ")

				}
			})
			res.redirect("/")
		} else {
			// console.log(foundItems)re
			res.render("list", { listTitle: "Today", newListItems: foundItems });
		}

	})


});

app.post("/", function (req, res) {

	const itemName = req.body.newItem;
	const listName = req.body.list;
	const item = new Item({
		name: itemName
	}) 
	if(listName=="Today"){
		item.save().then(console.log("  you have added new item Today"))
		res.redirect("/")
	}else{
		List.findOne({name:listName},(e,foundList)=>{
			foundList.items.push(item);
			foundList.save()
			res.redirect("/"+listName) 
		})
	}
	
	
});

app.post("/delete", function (req, res) {
	const checkedId = req.body.checkBox
	const listName=req.body.listName
	if(listName==="today"){
		Item.findByIdAndRemove(checkedId, function (e) {
			if (!e) {
				console.log("You have deleted the Item")
				res.redirect("/")
			}
		})
	}
	else{
		List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedId}}},(e,foundList)=>{
			if(!e)
			{
				res.redirect("/"+listName)
				console.log(checkedId)
			}
			
		})
	}
	
});


app.get("/:customListName", function(req, res){
	const customListName = req.params.customListName.toUpperCase();
  
	List.findOne({name: customListName}, function(err, foundList){
	  if (!err){
		if (!foundList){
		  const list=new List({
			  name:customListName,
			  items:defaultItems
		  })
		  list.save()
		  res.redirect("/" + customListName);
		} else {
		res.render("list", { listTitle:foundList.name, newListItems:foundList.items });
  
		
		}
	  }
	});
})


app.get("/about", function (req, res) {
	res.render("about");
});

app.listen(3000, function () {
	console.log("Server started on port 3000");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,()=>{
	console.log("Server has started succsfully  ")
});