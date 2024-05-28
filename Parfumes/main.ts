import express from "express";
import bcrypt from "bcrypt";
import { Fragrances } from "./interfaces";
import { connect } from "./database";
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from "dotenv";
import session from "./sessions";
import { User } from "./types";
import { login } from "./database";
import { secureMiddleware } from "./secureMiddleware";
import { loginRouter } from "./routes/loginRouter";
import { homeRouter } from "./routes/homeRouter";

const uri = "mongodb+srv://oussamaousi:MongoDB123@oussama-cluster.blxpfbi.mongodb.net/";
const client = new MongoClient(uri);

dotenv.config();
const app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(loginRouter());
app.use(homeRouter());
app.use(session);

let fragrancesData: Fragrances[] = [];

app.get("/", async (req, res) => {
  try {
    await client.connect();
    fragrancesData = await client.db("fragrancesDB").collection("fragrancesCollection").find<Fragrances>({}).toArray();
    res.render("index", { fragrances: fragrancesData });
  } catch (error) {
    console.error("Error fetching fragrances:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/", secureMiddleware, async(req, res) => {
  res.render("index", { fragrances: fragrancesData });
});
app.post("/login", async(req, res) => {
  const email : string = req.body.email;
  const password : string = req.body.password;
  try {
      let user : User = await login(email, password);
      delete user.password; 
      req.session.user = user;
      res.redirect("/")
  } catch (e : any) {
      res.redirect("/login");
  }
});

app.get("/logout", async(req, res) => {
  req.session.destroy(() => {
      res.redirect("/login");
  });
});

app.get("/detail/:id", async (req, res) => {
  const fragranceId = req.params.id;

  try {
    await client.connect();
    const database = client.db("fragrancesDB");
    const collection = database.collection("fragrancesCollection");
    const fragrance = await collection.findOne({ _id: new ObjectId(fragranceId) });

    if (fragrance) {
      if (fragrance.releasedate) {
        fragrance.releasedate = new Date(fragrance.releasedate);
      }
      res.render("detail", { fragrance });
    } else {
      res.status(404).send("Fragrance not found");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/edit/:id", async (req, res) => {
  const fragranceId = req.params.id;

  if (!ObjectId.isValid(fragranceId)) {
    console.error("Invalid ID format:", fragranceId);
    return res.status(400).send("Invalid ID format");
  }

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

  if (!ObjectId.isValid(fragranceId)) {
    console.error("Invalid ID format:", fragranceId);
    return res.status(400).send("Invalid ID format");
  }

  try {
    await client.connect();
    const database = client.db("fragrancesDB");
    const collection = database.collection("fragrancesCollection");

    const updateResult = await collection.updateOne(
      { _id: new ObjectId(fragranceId) },
      { $set: { description, category, price: parseFloat(price), season: season.split(",") } }
    );

    if (updateResult.modifiedCount >= 1) {
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
      await connect();
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
