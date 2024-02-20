export interface ApplicationSettings {
    defaultServicesTimeout: number | undefined;
    environment: 'production' | 'development';
    serverPort: number;
    // TODO: Can we put URL?
    emotionDetectionUrl: string;
}
