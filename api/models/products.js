const conexao = require('../config/conexao');
const ProductCategory = require('./product_category'); 

class Product{

    async create(product, res){

        const sql = 'INSERT INTO products(description, price) VALUES ($1, $2) RETURNING *';

        conexao.query(sql, [ product.description, product.price ], async (error, result) => {

            if(error){

                res.status(400);

            }else{

                if(product.categories){

                    let productId = result.rows[0].id;

                    let countCategories = product.categories.length;
                    let addedCategories = [];

                    let status = 201;

                    let promises = product.categories.map( async (category) => {

                        if(await ProductCategory.createRelation(productId, category)){

                            addedCategories.push(category);

                        }

                    });

                    await Promise.all(promises);

                    if(countCategories != addedCategories.length){

                        status = 206;

                    }

                    res.status(status).json({...result.rows[0], categories: addedCategories});

                }else{

                    res.status(201).json(result.rows[0]);

                }

            }

        });

    }

    async update(id, product, res){

        const sql = 'UPDATE products SET description = $1, price = $2 WHERE id = $3 RETURNING *;';

        conexao.query(sql, [ product.description, product.price, id ], async (error, result) => {

            if(error){

                res.status(400);

            }else{

                if(result.rowCount == 1){

                    if(product.categories){
    
                        let countCategories = product.categories.length;
                        let addedCategories = [];
    
                        let status = 200;
    
                        let promises = product.categories.map( async (category) => {
    
                            if(await ProductCategory.createRelation(id, category)){
    
                                addedCategories.push(category);
    
                            }
    
                        });
    
                        await Promise.all(promises);
    
                        let removedUnusedRelations = await ProductCategory.removeUnusedRelations(id, product.categories);
    
                        if(!removedUnusedRelations || (countCategories != addedCategories.length)){
    
                            status = 206;
    
                        }
    
                        res.status(status).json({...result.rows[0], categories: product.categories});
    
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

        let removedAllRelations = await ProductCategory.removeAllRelationsByProduct(id);

        if(removedAllRelations){

            const sql = 'DELETE FROM products WHERE id = $1 RETURNING *';
    
            conexao.query(sql, [ id ], (error, result) => {
    
                if(error){
    
                    res.status(400);
    
                }else{
    
                    if(result.rows.length == 1){

                        res.status(200).json(result.rows[0]);

                    }else{

                        res.status(404).json({message: 'Product  not found!'});

                    }
    
                }
    
            });

        }else{

            res.status(424);

        }

    }

    getAll(res){

        const sql = 'SELECT * FROM products';

        conexao.query(sql, (error, result) => {

            if(error){

                res.status(400);

            }else{

                res.status(200).json(result.rows);

            }

        });

    }

    getById(id, res){

        const sqlProduct = 'SELECT id, description, price FROM products WHERE id = $1';

        conexao.query(sqlProduct, [ id ], async (error, result) => {

            if(error){

                res.status(400);

            }else{

                if(result.rows.length == 1){

                    let product = result.rows[0];

                    try{

                        const sqlCategories = `SELECT id_category AS id FROM product_category WHERE id_product = $1`;

                        const resultSqlCategories = await conexao.query(sqlCategories, [ product.id ]);

                        let categories = resultSqlCategories.rows;

                        res.status(200).json({ ...product, categories });

                    }catch{

                        res.status(206).json(product);

                    }

                }else{

                    res.status(404);

                }

            }

        });

    }

}

module.exports = new Product;