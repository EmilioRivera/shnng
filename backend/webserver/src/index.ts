import express, { Request, Response } from "express";
import dotenv from "dotenv"
import { ApplicationSettings } from "./applicationSettings";
import bodyParser from "body-parser";
import { EmotionDetectionService } from "./services/emotionDetection/emotionDetectionService";
import { OutputEmotionDetectionResult } from "./services/emotionDetection/interfaces";

// TODO: Add more options
dotenv.config()

const APPLICATION_SETTINGS: ApplicationSettings = {
    environment: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    serverPort:  parseInt(process.env.SERVER_PORT || '3000'),
    emotionDetectionUrl: 'http://localhost:3000/unmapped',
    defaultServicesTimeout: parseInt(process.env.DEFAULT_SERVICES_TIMEOUT || '5000')
}

const app = express();
// TODO: Add configuration
const jsonBodyParser = bodyParser.json()
const emotionDetectionService = new EmotionDetectionService(APPLICATION_SETTINGS);

app.get('/', (_, res: Response) => {
    res.json({'test': 'val'})
});

interface ArticleSubmissionRequestBody {
    text: string;
}

app.post('/article-submission', jsonBodyParser, (req: Request<unknown, unknown, ArticleSubmissionRequestBody>, res: Response): void => {
    console.log('Req body is', req.body)
    const inputText = req.body.text || '';
    console.log('Input text is', inputText)
    // TODO: Add sanitization when appropriate
    emotionDetectionService.getEmotionFromText(inputText)
        .then((emotion: OutputEmotionDetectionResult) => {
            // TODO: Add some output formatting when necessary
            res.status(200).json(emotion)
        })
        .catch(() => {
            return res.status(500).json({ 'error': 'Failed to query emotion' });
        })
})

app.listen(APPLICATION_SETTINGS.serverPort, () => {
    console.log(`Listening on ${APPLICATION_SETTINGS.serverPort}`)
});
