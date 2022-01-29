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

const time = dayjs().format('HH:mm:ss');

const participantSchema = joi.object({
  name: joi.string().required(),
});

const messageSchema = joi.object({
  to: joi.string().required(),
  text: joi.string().required(),
  type: joi.valid('message', 'private_message').required(),
});

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect(() => {
  db = mongoClient.db("batePapoUOL_backEnd");
});

app.post('/participants', async (request, response) => {
  const { name } = request.body;

  const validation = participantSchema.validate(request.body, { abortEarly: false });

  if (validation.error) {
    return response.status(422).send(validation.error.details.map(error => error.message));
  }

  try {
    const isRegistered = await db.collection('participants').findOne({ name: name });

    if (isRegistered) {
      return response.sendStatus(409);
    }

    await db.collection('participants').insertOne({
      name: name,
      lastStatus: Date.now()
    });

    await db.collection('messages').insertOne({
      from: name,
      to: "Todos",
      text: "entra na sala...",
      type: "status",
      time: time
    });

    response.sendStatus(201);

  } catch (error) {
    console.error(error);
    response.sendStatus(500);
  }
});

app.get('/participants', async (request, response) => {
  try {
    const participants = await db.collection('participants').find().toArray();
    response.status(200).send(participants);

  } catch (error) {
    console.error(error);
    response.sendStatus(500);
  }
});

app.post('/messages', async (request, response) => {
  const message = request.body;
  const { user } = request.headers;

  try {
    const isOnline = await db.collection('participants').findOne({ name: user });
    if (!isOnline) {
      return response.sendStatus(422);
    }

    const validation = messageSchema.validate(message, { abortEarly: false });
    if (validation.error) {
      return response.status(422).send(validation.error.details.map(error => error.message));
    }

    await db.collection('participants').updateOne({ name: user }, { $set: { lastStatus: Date.now() } });

    await db.collection('messages').insertOne({
      from: user,
      ...message,
      time: time
    });

    response.sendStatus(201);

  } catch (error) {
    console.error(error);
    response.sendStatus(500);
  }
});

app.get('/messages', async (request, response) => {
  const { user } = request.headers;
  const limit = parseInt(request.header.limit);

  try {

    const messages = await db.collection('messages').find().toArray();

    const filteredMessages = messages.filter(message => message.from === user || message.to === user || message.to === 'Todos');

    if (limit === undefined) {
      return response.status(200).send(filteredMessages);
    }

    let limitedMessages = filteredMessages.slice(filteredMessages.length - limit, filteredMessages.length);
    response.status(200).send(limitedMessages);

  } catch (error) {
    console.error(error);
    response.sendStatus(500);
  }
});

app.post('/status', async (request, response) => {

  try {
    const participants = await db.collection('participants').find({}).toArray();

    participants.forEach(async participant => {
      if (Date.now() - participant.lastStatus > 10000) {
        await db.collection('messages').insertOne({
          from: participant.name,
          to: "Todos",
          text: "sai da sala...",
          type: "status",
          time: time
        })
        await db.collection('participants').deleteOne({ _id: participant._id });
      }
    });
    response.sendStatus(200);

  } catch (error) {
    console.error(error);
    response.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Servidor ${chalk.bgGreen(chalk.black(' ON '))} - Porta ${chalk.magenta(port)} - ${chalk.blue(`http://localhost:${port}`)}`);
});
