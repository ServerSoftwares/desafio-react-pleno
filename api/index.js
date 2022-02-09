const customExpress = require('./config/expressCustom');

const app = customExpress();

app.listen(3000, () => console.log('servidor rodando na porta 3000'));