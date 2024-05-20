import express from "express";
import {
    Fragrances
} from "./interfaces"
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://oussamaousi:MongoDB123@oussama-cluster.blxpfbi.mongodb.net/";
const client = new MongoClient(uri);

const app = express();
app.set('port', process.env.PORT || 3000);

app.set('view engine', 'ejs');
app.use(express.static("public"));

let fragrancesData: Fragrances[] = [];

app.get("/", async (req, res) => {
    res.render("index", { fragrances: fragrancesData });
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
      }
      );
    } catch (err) {
      console.error(err);
    }
  }
  main();