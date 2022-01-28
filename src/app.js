import express, { json } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import dayjs from 'dayjs';
import joi from 'joi';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(json());

const participantScheme = joi.object({
    name: joi.string().required(),
});

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect(() => {
    db = mongoClient.db("batePapoUOL_backEnd");
});

app.post('/participants', async (request, response) => {
    try {
        const { name } = request.body;

        const isRegistered = await db.collection('participants').findOne({ name: name });
        if (isRegistered) {
            return response.status(409).send("Nome já existe. Por favor, escolha outro.")
        }

        const validation = participantScheme.validate(request.body, { abortEarly: true });

        if (validation.error) {
            return response.status(422);
        }

        const time = dayjs().locale('pt-br').format('HH:MM:SS')

        await db.collection('participants').insertOne({ "name": name, "lastStatus": Date.now() });
        await db.collection('messages').insertOne({ "from": name, "to": "Todos", "text": "entra na sala", "type": "status", "time": time });
        response.sendStatus(201);
    } catch (error) {
        console.error(error);
        response.sendStatus(500);
    }
});


app.listen(port, () => {
    console.log(`Servidor ${chalk.bgGreen(chalk.black(' ON '))} - Porta ${chalk.magenta(port)} - ${chalk.blue(`http://localhost:${port}`)}`);
});
