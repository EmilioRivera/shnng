// What the emotion detection service should return support as operations
export interface EmotionDetectionService {
    getEmotionFromText(text: string): Promise<OutputEmotionDetectionResult>;
}

// TODO: Make this more appropriate
// This is the value we want to expose to the API callers
export interface OutputEmotionDetectionResult {
    emotion: string;
}

//
// "DTO"s
//

// What the service expects as input
export interface ServiceEmotionDetectionResultInput {
    text: string;
}

// This one comes from the backend service
export interface ServiceEmotionDetectionResultOutput {
    emotion: string;
}
