import express from "express";
import { allowedNodeEnvironmentFlags } from "process";
import{
    Fragrances
} from "./interfaces"

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'mongo-cluster-oussama';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db(dbName);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

module.exports = connectDB;

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(express.static("public"));
app.set('view engine', 'ejs');

const fragrances: Fragrances[] = [];

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname + "/views" });
});


app.listen(app.get('port'), async () => {
    try {
        const response = await fetch("https://raw.githubusercontent.com/OussamaOusi/TerminalApp/main/parfum.json");
        const parfume = await response.json();
        fragrances.push(...parfume);
    } catch (error) {
        console.log(error);
    }
    console.log('Server started on port '+ app.get('port'));
});