const conexao = require('../config/conexao');

class ProductCategory{

    async createRelation(product, category){

        const sql = "INSERT INTO product_category (id_product, id_category) VALUES ($1, $2)";

        product = parseInt(product);
        category = parseInt(category);

        try{

            await conexao.query(sql, [ product, category ]);

            return true;

        }catch{

            return false;

        }

    }

    async removeUnusedRelations(product, categories){

        const sql = "DELETE FROM product_category WHERE id_category NOT IN ($1) AND id_product = $2";

        categories = categories.map( ( category ) => { 

            let idCategory = parseInt(category);
            
            if(!isNaN(idCategory)){

                return idCategory;

            }

         }).join(', ');

         if(categories.length == 0){

            categories = 0;

         }

        try{

            await conexao.query(sql, [ categories, product ]);

            return true;

        }catch{

            return false;

        }

    }

    async removeAllRelationsByProduct(product){

        const sql = "DELETE FROM product_category WHERE id_product = $1";

        try{

            await conexao.query(sql, [ product ]);

            return true;

        }catch{

            return false;

        }

    }

    async removeAllRelationsByCategory(category){

        const sql = "DELETE FROM product_category WHERE id_category = $1";

        try{

            await conexao.query(sql, [ category ]);

            return true;

        }catch{

            return false;

        }

    }


}

module.exports = new ProductCategory;