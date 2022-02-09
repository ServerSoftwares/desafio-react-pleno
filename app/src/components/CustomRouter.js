import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Categorias from '../pages/Categorias';
import Categoria from '../pages/Categoria';
import Produtos from '../pages/Produtos';
import Produto from '../pages/Produto';
import Vendas from '../pages/Vendas';
import Venda from '../pages/Venda';

function CustomRouter(){

    return(
        <Routes className="content">
            <Route path="/" element={<Home />} />
            <Route path="categorias" element={<Categorias />} />
            <Route path="categoria" element={<Categoria />} />
            <Route path="categoria/:idCategoria" element={<Categoria />} />
            <Route path="produtos" element={<Produtos />} />
            <Route path="produto" element={<Produto />} />
            <Route path="produto/:idProduto" element={<Produto />} />
            <Route path="vendas" element={<Vendas />} />
            <Route path="venda" element={<Venda />} />
            <Route path="venda/:idVenda" element={<Venda />} />
        </Routes>
    )

}

export default CustomRouter;