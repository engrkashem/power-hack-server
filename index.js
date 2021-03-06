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


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rjiyy.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();

        const userCollection = client.db('power-hack').collection('users');
        const billCollection = client.db('power-hack').collection('bills');

        //delete a bill
        app.delete('/bill/:id', verifyToken, async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await billCollection.deleteOne(query);
            res.send(result);
        })

        //Load bills pagewise
        app.get('/bill', async (req, res) => {
            const result = await billCollection.find().toArray();
            let sum = 0;
            result.map(r => sum = r.amount);
            console.log(result);
            res.send({ result, sum });
        })

        //post/insert bill to database
        app.post('/bill', verifyToken, async (req, res) => {
            const bill = req.body;
            const result = await billCollection.insertOne(bill);
            res.send(result);
        })

        //verify user to authenticate
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await userCollection.findOne(query);
            const secretToken = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
            res.send({ result, secretToken });
        });

        //creating or updating user
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const option = { upsert: true };
            const updatedUser = {
                $set: user
            };
            const result = await userCollection.updateOne(filter, updatedUser, option);
            const secretToken = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
            res.send({ result, secretToken });
        });
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