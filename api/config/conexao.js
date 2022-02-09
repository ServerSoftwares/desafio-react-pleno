const { Client } = require('pg');

const conexao = new Client({
    host: 'localhost',
    user: 'postgres',
    database: 'postgres',
    password: 'root',
    port: 5432
});

conexao.connect();

module.exports = conexao;