import express, { json } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dayjs from 'dayjs';
import joi from 'joi';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(json());

let onlineUsersArray = [];
let onlineUsersList = onlineUsersArray.map(user => user.name);

const time = dayjs().format('HH:mm:ss');

const participantSchema = joi.object({
  name: joi.string().required(),
});

const messageSchema = joi.object({
  from: joi.string().valid(...onlineUsersList).required(),
  to: joi.string().required(),
  text: joi.string().required(),
  text: joi.valid('message', 'private_message').required()
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

    const validation = participantSchema.validate(request.body, { abortEarly: false });

    if (validation.error) {
      return response.status(422).send(validation.error.details.map(error => error.message));
    }


    await db.collection('participants').insertOne({
      name: name,
      lastStatus: Date.now()
    });

    await db.collection('messages').insertOne({
      from: name,
      to: "Todos",
      text: "entra na sala...",
      type: "message",
      time: time
    });

    onlineUsersArray.push({
      name: name,
      lastStatus: Date.now()
    })

    response.sendStatus(201);
  } catch (error) {
    console.error(error);
    response.sendStatus(500);
  }
});

app.get('/participants', async (request, response) => {
  try {
    const participants = await db.collection('participants').find().toArray();
    response.send(participants);
  } catch (error) {
    console.error(error);
    response.sendStatus(500);
  }
});


app.listen(port, () => {
  console.log(`Servidor ${chalk.bgGreen(chalk.black(' ON '))} - Porta ${chalk.magenta(port)} - ${chalk.blue(`http://localhost:${port}`)}`);
});
