const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

app.use(express.json());
const itemsPool = require('./dbConfig')

app.get('/', (req, res) => {
    res.send('Simple API homepage');
})

app.get('/api/items', async(req, res) => {
    try {
        const allItems = await itemsPool.query(
            'SELECT * FROM items'
        );
        res.json({ items: allItems.rows });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})

app.post('/api/items', async (req, res) => {
    const { description } = req.body;
    try {
        const newItem = await itemsPool.query(
            'INSERT INTO items (description) VALUES ($1) RETURNING *',
            [description]
        );
        res.status(201).json({ 
            message: "New item added!",
            item: newItem.rows
         });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})

app.listen(5070, () => {
    console.log("Server running on port 5070");
})