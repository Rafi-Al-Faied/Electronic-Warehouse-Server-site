const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const req = require("express/lib/request");
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




app.get('/', (req, res) => {
    res.send('running electronic server');
})


function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        console.log('decoded', decoded);
        req.decoded = decoded;
        next();
    })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.33stp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
    try {
        await client.connect();
        const ProductCollections = client.db('ElectornicProductsList').collection('product');
        const MyItemCollection = client.db('ElectornicProductsList').collection('myItemOrder');


        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({ accessToken });
        })

        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = ProductCollections.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        app.get('/Browsproducts', async (req, res) => {
            const query = {};
            const cursor = ProductCollections.find(query);
            const products = await cursor.limit(6).toArray();
            res.send(products);
        })

        app.get('/Browsproducts/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const product = await ProductCollections.findOne(query);
            res.send(product);
        })


        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const product = await ProductCollections.findOne(query);
            res.send(product);
        })

        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            const result = await ProductCollections.insertOne(newProduct);
            res.send(result);
        })



        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const updatedQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedQuantity.quantity,
                }
            };
            const result = await ProductCollections.updateOne(filter, updatedDoc, options);
            res.send(result);

        })

        app.put('/Browsproducts/:id', async (req, res) => {
            const id = req.params.id;
            const updatedQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedQuantity.quantity,
                }
            };
            const result = await ProductCollections.updateOne(filter, updatedDoc, options);
            res.send(result);

        })

        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const updatedQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedQuantity.quantity,
                }
            };
            const result = await ProductCollections.updateOne(filter, updatedDoc, options);
            res.send(result);

        })


        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ProductCollections.deleteOne(query);
            res.send(result);
        });


        app.get('/myorder', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email;
            const email = req.query.email;
            if (email === decodedEmail) {
                const query = { email: email };
                const cursor = orderCollection.find(query);
                const orders = await cursor.toArray();
                res.send(orders);
            }
            else{
                res.status(403).send({message: 'forbidden access'})
            }
        })

        app.post('/myorder', async (req, res) => {
            const order = req.body;
            const result = await MyItemCollection.insertOne(order);
            res.send(result);
        })


    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running electronic Server');
});

app.get('/hero', (req, res) =>{
    res.send('Hero meets hero ku')
})

app.listen(port, () => {
    console.log('listening to port', port);
})
