import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];
const db = new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"permalist",
  password:"1435840",
  port:5432,
});
db.connect();

async function getItems() {
  const result=await db.query("select * from items order by id asc");
  items=result.rows;
  console.log(items);
}



app.get("/", async(req, res) => {
  
  await getItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post ("/add", async(req, res) => {
  const item = req.body.newItem;
  await db.query("insert into items (title) values ($1) ",[item])
  items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
await db.query("update items set title=$1 where id=$2",[req.body.updatedItemTitle,req.body.updatedItemId])
res.redirect("/");

});

app.post("/delete", async(req, res) => {

  await db.query("delete from items where id=$1",[req.body.deleteItemId]);
  res.redirect("/");

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
