const conexao = require('../config/conexao');

class SaleProduct{

    async createRelation(sale, product){

        const searchRelation = "SELECT * FROM sale_product WHERE id_sale = $1 AND id_product = $2";

        sale = parseInt(sale);
        const quantity = parseInt(product?.quantity ?? 1);


        try{

            let resultSearchRelation = await conexao.query(searchRelation, [ sale, product.id ]);

            if(resultSearchRelation.rowCount == 0){

                const query = "INSERT INTO sale_product (id_sale, id_product, quantity) VALUES ($1, $2, $3)";

                let resultQuery = await conexao.query(query, [ sale, product.id, quantity ]);

                if(resultQuery.rowCount == 1){

                    return true;

                }else{

                    return false;

                }

            }else{

                const update = "UPDATE sale_product SET quantity = $1 WHERE id_sale = $2 AND id_product = $3";

                let resultUpdate = await conexao.query(update, [ quantity, sale, product.id ]);

                if(resultUpdate.rowCount == 1){

                    return true;

                }else{

                    return false;

                }

            }

        }catch{

            return false;

        }

    }

    async removeUnusedRelations(sale, products){

        const sql = "DELETE FROM sale_product WHERE id_product NOT IN ($1) AND id_sale = $2";

        products = products.map( ( product ) => { 
            
            let productId = parseInt(product.id); 

            if(!isNaN(productId)){

                return productId;

            } 
        
        }).join(', ');

        if(products.length == 0){

            products = 0;

        }

        try{

            await conexao.query(sql, [ products, sale ]);

            return true;

        }catch{

            return false;

        }

    }

    async removeAllRelationsByProduct(product){

        const sql = "DELETE FROM sale_product WHERE id_product = $1";

        try{

            await conexao.query(sql, [ product ]);

            return true;

        }catch{

            return false;

        }

    }

    async removeAllRelationsBySale(sale){

        const sql = "DELETE FROM sale_product WHERE id_sale = $1";

        try{

            await conexao.query(sql, [ sale ]);

            return true;

        }catch{

            return false;

        }

    }

}

module.exports = new SaleProduct;