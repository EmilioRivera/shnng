export interface ApplicationSettings {
    defaultServicesTimeout: number | undefined;
    environment: 'production' | 'development';
    serverPort: number;
}
