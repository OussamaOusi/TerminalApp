import express from "express";
import {
    Fragrances
} from "./interfaces"
import { MongoClient, ObjectId } from 'mongodb';

const uri = "mongodb+srv://oussamaousi:MongoDB123@oussama-cluster.blxpfbi.mongodb.net/";
const client = new MongoClient(uri);

const app = express();
app.set('port', process.env.PORT || 3000);

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

let fragrancesData: Fragrances[] = [];

app.get("/", async (req, res) => {
  fragrancesData = await client.db("fragrancesDB").collection("fragrancesCollection").find<Fragrances>({}).toArray();
    res.render("index", { fragrances: fragrancesData });
});

app.get("/detail/:id", async (req, res) => {
  res.render("detail", { fragrances: fragrancesData });
});

app.get("/edit/:id", async (req, res) => {
  const fragranceId = req.params.id;
  try {
      await client.connect();
      const database = client.db("fragrancesDB");
      const collection = database.collection("fragrancesCollection");
      const fragrance = await collection.findOne({ _id: new ObjectId(fragranceId) });

      if (fragrance) {
          res.render("edit", { fragrance });
      } else {
          res.status(404).send("Fragrance not found");
      }
  } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
  } 
});

app.post("/edit/:id", async (req, res) => {
  const fragranceId = req.params.id;
  const { description, category, price, season } = req.body;

  try {
      await client.connect();
      const database = client.db("fragrancesDB");
      const collection = database.collection("fragrancesCollection");

      const updateResult = await collection.updateOne(
          { _id: new ObjectId(fragranceId) },
          { $set: { description, category, price: parseFloat(price), season: season.split(",") } }
      );

      if (updateResult.modifiedCount === 1) {
          res.redirect("/");
      } else {
          res.status(404).send("Fragrance not found");
      }
  } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
  }
});


async function main() {
    try {
      await client.connect();
      console.log("Connected to MongoDB");
      const database = client.db("fragrancesDB");
      const fragrancesCheck = await database.collection("fragrancesCollection").findOne({});
  
      if (!fragrancesCheck) {
        const fragrancesResponse = await fetch('https://raw.githubusercontent.com/OussamaOusi/TerminalApp/main/parfum.json');
        const fragrancesData = await fragrancesResponse.json();
        fragrancesData.push(...fragrancesData);
  
        await database.collection("fragrancesCollection").insertMany(fragrancesData);
      }

      fragrancesData = await database.collection("fragrancesCollection").find<Fragrances>({}).toArray();
  
      app.listen(app.get('port'), async () => {
        console.log(`Server is running at http://localhost:${app.get('port')}`);
      });
      process.on('SIGINT', async () => {
        await client.close();
        process.exit(0);
      });
    } catch (err) {
      console.error(err);
    }
  }
  main();