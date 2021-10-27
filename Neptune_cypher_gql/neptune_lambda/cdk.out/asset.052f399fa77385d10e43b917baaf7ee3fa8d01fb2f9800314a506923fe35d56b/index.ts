import axios from 'axios';
import {APIGatewayProxyEvent, APIGatewayProxyResult , Context} from 'aws-lambda';

export async function handler(event: APIGatewayProxyEvent, context: Context) {

    try {

        await axios.post('HTTPS://'+process.env.NEPTUNE_ENDPOINT+':8182/openCypher','query=CREATE (n:person {age : 25})')

        const fetch =  await axios.post('HTTPS://'+ process.env.NEPTUNE_ENDPOINT+':8182/openCypher','query=MATCH (n:person { age: 25}) RETURN n.age')
        console.log("RESPONE", fetch.data.results)
        
        return {
            statusCode: 200,
            headers: {"Content-Type": "text/plain"},
            body: JSON.stringify(fetch.data.results),
        };
    }

    catch (e) {
        console.log('error', e);
        return {
            statusCode: 200,
            header: {"Content-Type": "text/plain"},
            body: "error occured"
        };
    }

    
    }


