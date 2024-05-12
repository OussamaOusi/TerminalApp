import express from "express";
import {
    Fragrances
} from "./interfaces"
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://oussamaousi:TesterBester123@mongo-cluster-oussama.ylvexkn.mongodb.net/"; // Fill in your MongoDB connection string here
const client = new MongoClient(uri);

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(express.static("public"));
app.set('view engine', 'ejs');

const fragrances: Fragrances[] = [];

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname + "/views" });
});

async function writeToMongoDB(data: Fragrances[]) {
    try {
        await client.connect();
        const database = client.db('fragrancesDB');
        const collection = database.collection('fragrancesCollection');
        await collection.insertMany(data);
        console.log("Data successfully written to MongoDB.");
    } catch (error) {
        console.error("Error writing data to MongoDB:", error);
    } finally {
        await client.close();
    }
}
app.get("/", async (req, res) => {
    try {
        await client.connect();
        const database = client.db('fragrancesDB');
        const collection = database.collection('fragrancesCollection');
        const result = await collection.find({}).toArray();
        if (result.length === 0) {
            const response = await fetch("https://raw.githubusercontent.com/OussamaOusi/TerminalApp/main/parfum.json");
            const data = await response.json();
            await writeToMongoDB(data);
            fragrances.push(...data);
        } else {
            fragrances.push(...result.map(item => ({
                id: item.id,
                name: item.name,
                description: item.description,
                age: item.age,
                has_website: item.has_website,
                releasedate: new Date(item.releasedate),
                profile_image_url: item.profile_image_url,
                category: item.category,
                price: item.price,
                season: item.season,
                details: {
                    id: item.details.id,
                    notes: {
                        top_notes: item.details.notes.top_notes,
                        middle_notes: item.details.notes.middle_notes,
                        base_notes: item.details.notes.base_notes
                    }
                }
            })));
        }
        res.sendFile("index.html", { root: __dirname + "/views" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
});
app.listen(app.get('port'), async () => {
    try {
        const response = await fetch("https://raw.githubusercontent.com/OussamaOusi/TerminalApp/main/parfum.json");
        const parfume = await response.json();
        fragrances.push(...parfume);
    } catch (error) {
        console.log(error);
    }
    console.log('Server started on port ' + app.get('port'));
});