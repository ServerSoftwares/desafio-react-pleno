const Category = require('../models/category');

module.exports = app => {

    app.get('/categories', (req, res) => {

        Category.getAll(res);

    });

    app.post('/categories', (req, res) => {

        let category = req.body;

        Category.create(category, res);

    });

    app.put('/categories/:id', (req, res) => {

        let id = parseInt(req.params.id);
        let category = req.body;

        Category.update(id, category, res);

    });

    app.delete('/categories/:id', (req, res) => {

        let id = parseInt(req.params.id);

        Category.delete(id, res);

    });

}