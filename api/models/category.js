const conexao = require('../config/conexao');

const ProductCategory = require('./product_category');

class Category{

    create(category, res){

        const sql = 'INSERT INTO categories(description) VALUES ($1) RETURNING *;';

        conexao.query(sql, [ category.description ], (error, result) => {

            if(error){

                res.status(400);

            }else{

                res.status(201).json(result.rows[0]);

            }

        });

    }

    update(id, category, res){

        const sql = 'UPDATE categories SET description = $1 WHERE id = $2 RETURNING *';

        conexao.query(sql, [ category.description, id ], (error, result) => {

            if(error){

                res.status(400);

            }else{

                res.status(200).json({id, ...category});

            }

        });

    }

    async delete(id, res){

        let removedAllRelations = await ProductCategory.removeAllRelationsByCategory(id);

        if(removedAllRelations){

            const sql = 'DELETE FROM categories WHERE id = $1';

            conexao.query(sql, [ id ], (error, result) => {

                if(error){

                    res.status(400);

                }else{

                    if(result.rowCount == 1){

                        res.status(200).json({ id });

                    }else{

                        res.status(404);

                    }

                }

            });

        }else{

            res.status(424);

        }

    }

    getAll(res){

        const sql = 'SELECT * FROM categories;';

        conexao.query(sql, (error, result) => {

            if(error){

                res.status(400);

            }else{

                res.status(200).json(result.rows);

            }

        })

    }

    getById(id, res){

        const sql = 'SELECT * FROM categories WHERE id = $1;';

        conexao.query(sql, [ id ], (error, result) => {

            if(error){

                res.status(400);

            }else{

                res.status(200).json(result.rows);

            }

        });

    }

}

module.exports = new Category;