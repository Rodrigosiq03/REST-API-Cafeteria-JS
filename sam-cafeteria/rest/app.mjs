import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const FetchAllProducts = async (event, context) => {
    console.info(`received: ${event}`);
    
    var params = {
        TableName: 'cafeteria-sam-api',
    }
    try {
        const data = await ddbDocClient.send(new ScanCommand(params));
        var items = data.Items;
    } catch (err) {
        console.log("Error", err);
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            Items: items
        }),
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
export const CreateProduct = async (event, context) => {
    console.info(`received: ${event}`);

    const { id, productName, productDesc, productPrice } = JSON.parse(event.body);
    

    var params = {
        TableName: 'cafeteria-sam-api',
        Item: {
            id,
            productName,
            productDesc,
            productPrice

        }
    }
    try {
        const data = await ddbDocClient.send(new PutCommand(params));
        console.log("SUCCESS - item added or updated", data);
    } catch (err) {
        console.log("Error", err);
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: `Product ${productName} created with id: ${id}`,
        }),
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
export const DeleteProduct = async (event, context) => {
    console.info(`received: ${event}`);
    

    var params = {
        TableName: 'cafeteria-sam-api',
        Key: {
            id: event.pathParameters.id
        },
    }
    try {
        const data = await ddbDocClient.send(new DeleteCommand(params));
        console.log("SUCCESS - item deleted", data);
    } catch (err) {
        console.log("Error", err);
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: `Product deleted with id: ${event.pathParameters.id}`,
        }),
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
export const UpdateProduct = async (event, context) => {
    console.info(`received: ${event}`);
    

    const { productName, productDesc, productPrice } = JSON.parse(event.body);
    var params = {
        TableName: 'cafeteria-sam-api',
        Key: {
            id: event.pathParameters.id
        },
        UpdateExpression: "set productName = :n, productDesc = :d, productPrice = :p",
        ExpressionAttributeValues: {
            ":n": productName,
            ":d": productDesc,
            ":p": productPrice
        },
        ReturnValues: "UPDATED_NEW"
    }
    try {
        const data = await ddbDocClient.send(new UpdateCommand(params));
        console.log("SUCCESS - item updated", data);
    } catch (err) {
        console.log("Error", err);
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: `Product updated with id: ${event.pathParameters.id}`,
        }),
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}

