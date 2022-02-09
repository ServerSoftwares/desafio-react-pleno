const Sale = require('../models/sales');

module.exports = app => {

    app.get('/sales', (req, res) => {

        Sale.getAll(res);

    });

    app.get('/sales/:id', (req, res) => {

        let id = parseInt(req.params.id);

        Sale.getById(id, res);

    });

    app.post('/sales', (req, res) => {

        let sale = req.body;

        Sale.create(sale, res);

    });

    app.put('/sales/:id', (req, res) => {

        let id = parseInt(req.params.id);
        let sale = req.body;

        Sale.update(id, sale, res);

    });

    app.delete('/sales/:id', (req, res) => {

        let id = parseInt(req.params.id);

        Sale.delete(id, res);
    
    });

}