# Desafio React Pleno

## Passos para realizar o desafio
- Você deve criar um repositório com para esse desafio. 
- Desenvolver as aplicações conforme descrito abaixo.
- Após finalizar, faça o push para seu repositório, revise seu código e envie por e-mail o endereço do repositório para que possamos analisar o código.

## Descritivo do desafio

### Backend

- Criar um backend em Node.js, acessando um banco de dados (Postgres ou MongoDB).

- Criar um banco com a seguinte estrutura
  - categories
    - id
    - description
  - products
    - id
    - description
    - price
    - categories []
  - sales
    - id
    - products []
    - clientName
    - totalAmount

- Criar o CRUD REST para a estrutura acima

### FrontEnd

- Criar um frontend em ReactJS
- Criar as telas de CRUD de cada uma das entidades do banco
- Utilizar REST para a comunicação com o backend
- Deverá haver um menu para acesso aos cadastros de cada entidade, assim como a listagem com possibilidade de filtro por um ou mais campos da entidade
- Obrigatório o controle de estados de todas as telas.


### Observações

> O projeto precisa rodar em containers. Então não esqueça de adicionar ao projeto o Dockerfile e os arquivos de deploy do mesmo.
