const conexao = require('../config/conexao');

const SaleProduct = require('./sale_product');

class Sale{

    getAll(res){

        const sql = 'SELECT * FROM sales;';

        conexao.query(sql, (error, result) => {

            if(error){

                res.status(400);

            }else{

                res.status(200).json(result.rows);
                
            }

        });

    }

    async create(sale, res){

        const sql = 'INSERT INTO sales (clientName, totalAmount) VALUES ($1, $2) RETURNING *';

        conexao.query(sql, [ sale.clientName, sale.totalAmount ], async (error, result) => {

            if(error){
                
                res.status(400);

            }else{

                if(sale.products){

                    let saleId = result.rows[0].id;

                    let countProducts = sale.products.length;
                    let addedProducts = [];

                    let status = 201;

                    let promises = sale.products.map( async (product) => {

                        if(await SaleProduct.createRelation(saleId, product)){

                            addedProducts.push(product);

                        }

                    } );

                    await Promise.all(promises);

                    if(countProducts != addedProducts.length){

                        status = 206;

                    }

                    res.status(status).json({ ...result.rows[0], products: addedProducts });

                }else{

                    res.status(201).json(result.rows[0]);

                }

            }

        });

    }

    async update(id, sale, res){

        const sql = "UPDATE sales SET clientName = $1, totalAmount = $2 WHERE id = $3 RETURNING *";

        conexao.query(sql, [ sale.clientName, sale.totalAmount, id ], async (error, result) => {

            if(error){

                res.status(400);

            }else{

                if(result.rowCount == 1){

                    if(sale.products){

                        let countProducts = sale.products.length;
                        let addedProducts = [];

                        let status = 201;

                        let promises = sale.products.map( async (product) => {

                            if(await SaleProduct.createRelation(id, product)){

                                addedProducts.push(product)

                            }

                        });

                        await Promise.all(promises);

                        let removedUnusedRelations = await SaleProduct.removeUnusedRelations(id, sale.products);

                        if(!removedUnusedRelations || (countProducts != addedProducts.length)){

                            status = 206;

                        }

                        res.status(status).json({...result.rows[0], products: addedProducts});

                    }else{

                        res.status(200).json(result.rows[0]);

                    }

                }else{

                    res.status(404);

                }

            }

        });

    }

    async delete(id, res){

        let removedAllRelations = SaleProduct.removeAllRelationsBySale(id);

        if(removedAllRelations){

            const sql = 'DELETE FROM sales WHERE id = $1 RETURNING *';

            conexao.query(sql, [ id ], (error, result) => {

                if(error){

                    res.status(400);

                }else{

                    if(result.rows.length == 1){

                        res.status(200).json(result.rows[0]);

                    }else{

                        res.status(404).json({message: 'Sale  not found!'});

                    }

                }

            });

        }else{

            res.status(424);

        }

    }

    getById(id, res){

        const sqlSale = "SELECT id, clientName, totalAmount FROM sales WHERE id = $1";

        conexao.query(sqlSale, [ id ], (sError, sResult) => {

            if(sError){

                res.status(400);
            
            }else{

                if(sResult.rows.length > 0){

                    let sale = sResult.rows[0];

                    const sqlProducts = "SELECT id_product AS id, quantity FROM sale_product WHERE id_sale = $1";

                    conexao.query(sqlProducts, [ sale.id ], (pError, pResult) => {

                        if(pError){

                            res.status(206).json(sale);

                        }else{

                            res.status(200).json({ ...sale, products: pResult.rows });

                        }

                    });

                }else{

                    res.status(404);

                }

            }

        });

    }

}

module.exports = new Sale;