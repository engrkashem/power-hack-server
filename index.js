const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { use } = require('express/lib/application');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized Access' });
    }
    const secretToken = authHeader.split(' ')[1];

    jwt.verify(secretToken, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden Access' });
        }
        req.decoded = decoded;
        next(); //to go further / read rest code after calling function.
    });
};

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvrai.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        /* await client.connect();
        const toolCollection = client.db('sks-inc').collection('tools');
        const userCollection = client.db('sks-inc').collection('users');
        const orderCollection = client.db('sks-inc').collection('orders');
        const paymentCollection = client.db('sks-inc').collection('payments');
        const reviewCollection = client.db('sks-inc').collection('reviews'); */

    }
    finally {

    }
};
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Power Hack Server is Running');
});

app.listen(port, () => {
    console.log('Power Hack Server is Listening fron port: ', port);
})