import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Swal from 'sweetalert2';

function Produto(){

    const { idProduto } = useParams();
    const navigate = useNavigate();
    const [ acaoPagina, setAcaoPagina ] = useState('Cadastrar');

    const [ descricaoProduto, setDescricaoProduto ] = useState('');
    const [ precoProduto, setPrecoProduto ] = useState('');

    const [ categorias, setCategorias ] = useState([]);

    const [ acao, setAcao ] = useState('POST');

    useEffect(async () => {

        const produto = await fetch(`http://localhost:3000/products/${idProduto}`)
        .then(data => {

            if(data.status === 200){

                return data.json()

            }else{

                return undefined;

            }

        });

        if(produto !== undefined){

            setAcao('PUT');
            setAcaoPagina('Editar')

            setDescricaoProduto(produto.description);
            setPrecoProduto(produto.price);

        }

        const categorias = await fetch(`http://localhost:3000/categories`)
        .then(data => data.json())
        .then(data => {

            return data.map((categoria) => {
    
                let selected = false;

                if(produto !== undefined){

                    produto.categories.forEach((categoriaProduto) => {
    
                        if(categoriaProduto.id == categoria.id){
    
                            selected = true;
    
                        }
    
                    });

                }

                return { ...categoria, selected };

            });

        });

        setCategorias(categorias);

    }, []);

    function exitForm(){

        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: 'As alterações feitas não serão salvas, deseja sair?',
            confirmButtonText: 'Não',
            confirmButtonColor: '#dc3545',
            showCancelButton: true,
            cancelButtonText: 'Sim',
            cancelButtonColor: '#198754',
            reverseButtons: true,
            allowOutsideClick: false,
            allowEscapeKey: false
        })
        .then((res) => {

            if(!res.isConfirmed){

                navigate('/produtos');

            }

        });

    }

    function saveInfo(){

        Swal.fire({
            icon: 'info',
            title: 'Aguarde',
            text: 'As informações estão sendo salvas...',
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false
        });

        fetch(`http://localhost:3000/products${ (acao == 'POST' ? '' : `/${idProduto}`) }`, {
            method: acao,
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                description: descricaoProduto,
                price: precoProduto,
                categories: categorias.filter(( categoria ) => categoria.selected).map((categoria) => categoria.id )
            })
        })
        .then(data => {

            switch(data.status){

                case 200:

                    Swal.update({
                        icon: 'success',
                        title: 'Sucesso',
                        text: 'As informações foram atualizadas!',
                        showConfirmButton: true,
                        allowOutsideClick: true,
                        allowEscapeKey: true
                    });

                    navigate('/produtos');

                break;

                case 201:

                    Swal.update({
                        icon: 'success',
                        title: 'Sucesso',
                        text: 'O produto foi cadastrado!',
                        showConfirmButton: true,
                        allowOutsideClick: true,
                        allowEscapeKey: true
                    });

                break;

                case 206:

                    Swal.update({
                        icon: 'success',
                        title: 'Sucesso',
                        text: 'As informações foram atualizadas! Porém as categorias não foram atualizadas corretamente.',
                        showConfirmButton: true,
                        allowOutsideClick: true,
                        allowEscapeKey: true
                    });

                break;

                case 400:

                    Swal.update({
                        icon: 'warning',
                        title: 'Atenção',
                        text: 'Houve um erro ao atualizar as informações!',
                        showConfirmButton: true,
                        allowOutsideClick: true,
                        allowEscapeKey: true
                    });

                break;

                case 404:

                    Swal.update({
                        icon: 'warning',
                        title: 'Atenção',
                        text: 'O produto informado não foi encontrado!',
                        showConfirmButton: true,
                        allowOutsideClick: true,
                        allowEscapeKey: true
                    });

                break;

                default:

                    Swal.update({
                        icon: 'warning',
                        title: 'Atenção',
                        text: 'Houve um erro não catalogado!',
                        showConfirmButton: true,
                        allowOutsideClick: true,
                        allowEscapeKey: true
                    });

                break;

            }

        });

    }

    return(
    <div className="content">
        <div className="row mb-4">
            <div className="col-12">
                <h1>{ acaoPagina } Produto</h1>
            </div>
        </div>
        <div className="row mb-2">
            <div className="col-12 col-md-6">
                <div className="form-group">
                    <label>
                        Descrição
                    </label>
                    <input type="text" className="form-control" value={descricaoProduto} onChange={ (e) => {
                        
                        setDescricaoProduto(e.target.value);
                        
                    }} />
                </div>
            </div>
            <div className="col-12 col-md-6">
                <div className="form-group">
                    <label>
                        Preço
                    </label>
                    <input type="text" className="form-control"  value={precoProduto} onChange={ (e) => {
                        
                        setPrecoProduto(e.target.value);
                        
                    }} />
                </div>
            </div>
            <div className="col-12 col-md-6">
                <div className="form-group">
                    <label>
                        Categorias
                    </label>
                    <div>
                        { categorias.map( (categoria) => {

                            return(<label key={`categoria-${categoria.id}`} className="d-block">
                                <input type="checkbox" className="mr-2" defaultChecked={categoria.selected} onChange={ (e) => {

                                    setCategorias(categorias.map((c) => {

                                        let selected = c.selected;

                                        if(c.id == categoria.id){

                                            selected = e.target.checked;

                                        }

                                        return {...c, selected};

                                    }));

                                } } />
                                { categoria.description }
                            </label>)

                        } ) }
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-12 text-end">
                <button className="btn btn-warning me-2" onClick={exitForm}>
                    Voltar
                </button>
                <button className="btn btn-success" onClick={saveInfo}>
                    Salvar
                </button>
            </div>
        </div>
    </div>
    )

}

export default Produto;