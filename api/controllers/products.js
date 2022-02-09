const Product = require('../models/products');

module.exports = app => {

    app.get('/products', (req, res) => {

        res.setHeader('Access-Control-Allow-Origin', '*');

        Product.getAll(res);

    });

    app.get('/products/:id', (req, res) => {

        let id = parseInt(req.params.id);

        Product.getById(id, res);

    });

    app.post('/products', (req, res) => {

        let category = req.body;

        Product.create(category, res);

    });

    app.put('/products/:id', (req, res) => {

        let id = parseInt(req.params.id);
        let category = req.body;

        Product.update(id, category, res);

    });

    app.delete('/products/:id', (req, res) => {

        let id = parseInt(req.params.id);

        Product.delete(id, res);

    });

}