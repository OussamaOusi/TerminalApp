import express from "express";
import { Fragrances } from "../interfaces";
import { MongoClient, ObjectId } from 'mongodb';

let fragrancesData: Fragrances[] = [];
const uri = "mongodb+srv://oussamaousi:MongoDB123@oussama-cluster.blxpfbi.mongodb.net/";
const client = new MongoClient(uri);
export function homeRouter() {
    const router = express.Router();
    
    router.get("/", async(req, res) => {
        await client.connect();
        fragrancesData = await client.db("fragrancesDB").collection("fragrancesCollection").find<Fragrances>({}).toArray();
        res.render("index", { fragrances: fragrancesData });
    });

    return router;
}