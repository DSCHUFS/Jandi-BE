interface ApiResponse<T> {
    successful: boolean,
    data?: T,
    message: string,
    timestamp: string,
}

export default ApiResponse;

export function prepareResponse<T>(data: T, message: string): ApiResponse<T> {
    return {
        successful: true,
        data: data,
        message: message,
        timestamp: new Date().toISOString(),
    };
}
