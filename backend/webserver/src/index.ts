import express, { Response } from "express";
import dotenv from "dotenv"
import { ApplicationSettings } from "./applicationSettings";

// TODO: Add more options
dotenv.config()

const APPLICATION_SETTINGS: ApplicationSettings = {
    environment: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    serverPort:  parseInt(process.env.SERVER_PORT || '3000'),
    defaultServicesTimeout: parseInt(process.env.DEFAULT_SERVICES_TIMEOUT || '5000')
}

const app = express();

app.get('/', (_, res: Response) => {
    res.json({'test': 'val'})
});

app.listen(APPLICATION_SETTINGS.serverPort, () => {
    console.log(`Listening on ${APPLICATION_SETTINGS.serverPort}`)
});
