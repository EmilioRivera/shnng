import { ApplicationSettings } from "../../applicationSettings";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ServiceEmotionDetectionResultInput, OutputEmotionDetectionResult, ServiceEmotionDetectionResultOutput } from "./interfaces";


export class EmotionDetectionService implements EmotionDetectionService {
    private readonly serviceUrl: string = ""
    private readonly requestConfig: AxiosRequestConfig<ServiceEmotionDetectionResultInput>;
    constructor(applicationSettings: ApplicationSettings) {
        this.serviceUrl = applicationSettings.emotionDetectionUrl;
        this.requestConfig = {
            timeout: applicationSettings.defaultServicesTimeout
        }
    }
    public async getEmotionFromText(text: string): Promise<OutputEmotionDetectionResult> {
        console.log(`Going to query ${this.serviceUrl}`)
        return axios.post(this.serviceUrl, {'text': text}, this.requestConfig)
            .catch((reason: any) => {
                // TODO: Better logging
                console.error(reason)
                console.error('Failed to gather emotion from service: ')
            })
            .then((d: AxiosResponse<ServiceEmotionDetectionResultOutput>) => {
                return {'emotion': d.data.emotion}
            });
    }
}