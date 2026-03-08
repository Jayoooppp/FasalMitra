/**
 * AWS DynamoDB Provider
 * 
 * Replaces MongoDB/Mongoose with DynamoDB for all data operations.
 * Tables are auto-created on first connection if they don't exist.
 * 
 * Tables:
 *   - fasalmitra_users      (PK: email)
 *   - fasalmitra_tasks       (PK: userId, SK: taskId)
 *   - fasalmitra_listings    (PK: userId, SK: listingId)
 */

const { v4: uuidv4 } = require('uuid');

const TABLE_PREFIX = process.env.AWS_DYNAMODB_TABLE_PREFIX || 'fasalmitra_';
const TABLES = {
    USERS: `${TABLE_PREFIX}users`,
    TASKS: `${TABLE_PREFIX}tasks`,
    LISTINGS: `${TABLE_PREFIX}listings`,
};

function getDocClient() {
    const { getDynamoDBDocClient } = require('../../config/aws');
    return getDynamoDBDocClient();
}

// ───────────────────────────────────────────
// User Operations
// ───────────────────────────────────────────

async function createUser(data) {
    const { PutCommand } = require('@aws-sdk/lib-dynamodb');
    const bcrypt = require('bcryptjs');
    const docClient = getDocClient();

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const userId = uuidv4();

    const item = {
        userId,
        email: data.email.toLowerCase().trim(),
        name: data.name,
        password: hashedPassword,
        phone: data.phone || '',
        location: data.location,
        farmSize: data.farmSize,
        soilType: data.soilType,
        preferredLanguage: data.preferredLanguage || 'English',
        activeCrops: data.activeCrops || [],
        createdAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({
        TableName: TABLES.USERS,
        Item: item,
        ConditionExpression: 'attribute_not_exists(email)',
    }));

    // Return in a shape compatible with existing code
    const user = { ...item, _id: userId, id: userId };
    user.comparePassword = async (candidate) => bcrypt.compare(candidate, item.password);
    return user;
}

async function findUserByEmail(email) {
    const { QueryCommand } = require('@aws-sdk/lib-dynamodb');
    const bcrypt = require('bcryptjs');
    const docClient = getDocClient();

    const result = await docClient.send(new QueryCommand({
        TableName: TABLES.USERS,
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email.toLowerCase().trim() },
        Limit: 1,
    }));

    if (!result.Items || result.Items.length === 0) return null;

    const item = result.Items[0];
    const user = {
        ...item,
        _id: item.userId,
        id: item.userId,
        comparePassword: async (candidate) => bcrypt.compare(candidate, item.password),
    };
    return user;
}

async function findUserById(id) {
    const { GetCommand } = require('@aws-sdk/lib-dynamodb');
    const docClient = getDocClient();

    const result = await docClient.send(new GetCommand({
        TableName: TABLES.USERS,
        Key: { userId: id },
    }));

    if (!result.Item) return null;
    const item = result.Item;
    return { ...item, _id: item.userId, id: item.userId };
}

async function updateUser(id, data) {
    const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');
    const docClient = getDocClient();

    const updateParts = [];
    const exprValues = {};
    const exprNames = {};

    const fields = ['name', 'phone', 'location', 'farmSize', 'soilType', 'preferredLanguage'];
    for (const field of fields) {
        if (data[field] !== undefined) {
            updateParts.push(`#${field} = :${field}`);
            exprValues[`:${field}`] = data[field];
            exprNames[`#${field}`] = field;
        }
    }

    if (updateParts.length === 0) return findUserById(id);

    await docClient.send(new UpdateCommand({
        TableName: TABLES.USERS,
        Key: { userId: id },
        UpdateExpression: `SET ${updateParts.join(', ')}`,
        ExpressionAttributeValues: exprValues,
        ExpressionAttributeNames: exprNames,
    }));

    return findUserById(id);
}

async function addActiveCrop(userId, crop) {
    const user = await findUserById(userId);
    if (!user) throw new Error('User not found');

    const newCrop = {
        _id: uuidv4(),
        name: crop.name,
        emoji: crop.emoji || '🌱',
        season: crop.season || 'Kharif',
        startDate: crop.startDate || new Date().toISOString(),
        acreage: crop.acreage || 1,
        dayCount: crop.dayCount || 0,
        totalDays: crop.totalDays || 120,
    };

    const activeCrops = [...(user.activeCrops || []), newCrop];

    const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');
    const docClient = getDocClient();

    await docClient.send(new UpdateCommand({
        TableName: TABLES.USERS,
        Key: { userId },
        UpdateExpression: 'SET activeCrops = :crops',
        ExpressionAttributeValues: { ':crops': activeCrops },
    }));

    return { ...user, activeCrops };
}

async function removeActiveCrop(userId, cropId) {
    const user = await findUserById(userId);
    if (!user) throw new Error('User not found');

    const activeCrops = (user.activeCrops || []).filter(c => c._id !== cropId);

    const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');
    const docClient = getDocClient();

    await docClient.send(new UpdateCommand({
        TableName: TABLES.USERS,
        Key: { userId },
        UpdateExpression: 'SET activeCrops = :crops',
        ExpressionAttributeValues: { ':crops': activeCrops },
    }));

    return { ...user, activeCrops };
}

// ───────────────────────────────────────────
// Task Operations
// ───────────────────────────────────────────

async function getTasks(userId) {
    const { QueryCommand } = require('@aws-sdk/lib-dynamodb');
    const docClient = getDocClient();

    const result = await docClient.send(new QueryCommand({
        TableName: TABLES.TASKS,
        KeyConditionExpression: 'userId = :uid',
        ExpressionAttributeValues: { ':uid': userId },
        ScanIndexForward: false,
    }));

    return (result.Items || []).map(item => ({
        ...item, _id: item.taskId, id: item.taskId,
    }));
}

async function createTask(data) {
    const { PutCommand } = require('@aws-sdk/lib-dynamodb');
    const docClient = getDocClient();
    const taskId = uuidv4();

    const item = {
        userId: data.userId.toString(),
        taskId,
        title: data.title,
        description: data.description || '',
        priority: data.priority || 'green',
        completed: data.completed || false,
        dueDate: data.dueDate || '',
        createdAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({
        TableName: TABLES.TASKS,
        Item: item,
    }));

    return { ...item, _id: taskId, id: taskId };
}

async function updateTask(id, userId, data) {
    const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');
    const docClient = getDocClient();

    const updateParts = [];
    const exprValues = {};
    const exprNames = {};

    const fields = ['title', 'description', 'priority', 'completed', 'dueDate'];
    for (const field of fields) {
        if (data[field] !== undefined) {
            updateParts.push(`#${field} = :${field}`);
            exprValues[`:${field}`] = data[field];
            exprNames[`#${field}`] = field;
        }
    }

    if (updateParts.length === 0) return null;

    const result = await docClient.send(new UpdateCommand({
        TableName: TABLES.TASKS,
        Key: { userId: userId.toString(), taskId: id },
        UpdateExpression: `SET ${updateParts.join(', ')}`,
        ExpressionAttributeValues: exprValues,
        ExpressionAttributeNames: exprNames,
        ReturnValues: 'ALL_NEW',
    }));

    const item = result.Attributes;
    return item ? { ...item, _id: item.taskId, id: item.taskId } : null;
}

async function deleteTask(id, userId) {
    const { DeleteCommand } = require('@aws-sdk/lib-dynamodb');
    const docClient = getDocClient();

    await docClient.send(new DeleteCommand({
        TableName: TABLES.TASKS,
        Key: { userId: userId.toString(), taskId: id },
    }));

    return { _id: id, id };
}

// ───────────────────────────────────────────
// Listing Operations
// ───────────────────────────────────────────

async function getListings(filters = {}) {
    const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
    const docClient = getDocClient();

    // Simple scan with optional filter (not ideal for production scale)
    const params = { TableName: TABLES.LISTINGS };

    const result = await docClient.send(new ScanCommand(params));
    return (result.Items || []).map(item => ({
        ...item, _id: item.listingId, id: item.listingId,
    }));
}

async function createListing(data) {
    const { PutCommand } = require('@aws-sdk/lib-dynamodb');
    const docClient = getDocClient();
    const listingId = uuidv4();

    const item = {
        userId: data.userId.toString(),
        listingId,
        crop: data.crop,
        quantity: data.quantity,
        expectedPrice: data.expectedPrice,
        status: data.status || 'active',
        createdAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({
        TableName: TABLES.LISTINGS,
        Item: item,
    }));

    return { ...item, _id: listingId, id: listingId };
}

// ───────────────────────────────────────────
// Table Creation (called on connect)
// ───────────────────────────────────────────

async function connect() {
    const { CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
    const { getDynamoDBClient } = require('../../config/aws');
    const client = getDynamoDBClient();

    const tableDefs = [
        {
            TableName: TABLES.USERS,
            KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
            AttributeDefinitions: [
                { AttributeName: 'userId', AttributeType: 'S' },
                { AttributeName: 'email', AttributeType: 'S' },
            ],
            GlobalSecondaryIndexes: [
                {
                    IndexName: 'email-index',
                    KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
                    Projection: { ProjectionType: 'ALL' },
                    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
                },
            ],
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
        },
        {
            TableName: TABLES.TASKS,
            KeySchema: [
                { AttributeName: 'userId', KeyType: 'HASH' },
                { AttributeName: 'taskId', KeyType: 'RANGE' },
            ],
            AttributeDefinitions: [
                { AttributeName: 'userId', AttributeType: 'S' },
                { AttributeName: 'taskId', AttributeType: 'S' },
            ],
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
        },
        {
            TableName: TABLES.LISTINGS,
            KeySchema: [
                { AttributeName: 'userId', KeyType: 'HASH' },
                { AttributeName: 'listingId', KeyType: 'RANGE' },
            ],
            AttributeDefinitions: [
                { AttributeName: 'userId', AttributeType: 'S' },
                { AttributeName: 'listingId', AttributeType: 'S' },
            ],
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
        },
    ];

    for (const def of tableDefs) {
        try {
            await client.send(new DescribeTableCommand({ TableName: def.TableName }));
            console.log(`  ✅ Table ${def.TableName} exists`);
        } catch (err) {
            if (err.name === 'ResourceNotFoundException') {
                console.log(`  📦 Creating table ${def.TableName}...`);
                await client.send(new CreateTableCommand(def));
                console.log(`  ✅ Table ${def.TableName} created`);
            } else {
                throw err;
            }
        }
    }

    console.log('DynamoDB Connected');
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updateUser,
    addActiveCrop,
    removeActiveCrop,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    getListings,
    createListing,
    connect,
};
