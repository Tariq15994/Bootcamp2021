import { APIGatewayProxyEvent, Context } from 'aws-lambda';
export declare function handler(event: APIGatewayProxyEvent, context: Context): Promise<{
    statusCode: number;
    headers: {
        "Content-Type": string;
    };
    body: string;
    header?: undefined;
} | {
    statusCode: number;
    header: {
        "Content-Type": string;
    };
    body: string;
    headers?: undefined;
}>;
