import express, { json } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import joi from 'joi';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(json());


app.listen(port, () => {
    console.log(`Servidor ${chalk.bgGreen(chalk.black(' ON '))} - Porta ${chalk.magenta(port)} - ${chalk.blue(`http://localhost:${port}`)}`);
});
