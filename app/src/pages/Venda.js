import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

function Venda(){

    const { idVenda } = useParams();
    const navigate = useNavigate();
    const [ acaoPagina, setAcaoPagina ] = useState('Cadastrar');

    const [ nomeCliente, setNomeCliente ] = useState('');
    const [ valorVenda, setValorVenda ] = useState('');

    const [ acao, setAcao ] = useState('POST');

    const [ produtos, setProdutos ] = useState([]);

    const moneyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    useEffect(async () => {

        const venda = await fetch(`http://localhost:3000/sales/${idVenda}`)
        .then(data => {

            if(data.status === 200){

                return data.json()

            }else{

                return undefined;

            }

        });

        if(venda !== undefined){

            setAcao('PUT');
            setAcaoPagina('Editar')

            setNomeCliente(venda.clientname);
            setValorVenda(venda.totalamount);

        }

        const produtos = await fetch('http://localhost:3000/products')
        .then(data => data.json())
        .then(data => {

            return data.map((produto) => {

                let selected = false;
                let quantity = 1;

                if(venda !== undefined){

                    venda.products.forEach((produtoVenda) => {

                        if(produtoVenda.id == produto.id ){

                            selected = true;
                            quantity = produtoVenda.quantity

                        }

                    });

                }

                return { ...produto, selected, quantity };

            });

        });

        setProdutos(produtos);

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

                navigate('/vendas');

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

        fetch(`http://localhost:3000/sales${ (acao == 'POST' ? '' : `/${idVenda}`) }`, {
            method: acao,
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                clientName: nomeCliente,
                totalAmount: valorVenda,
                products: produtos.filter((produto) => produto.selected)
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

                    navigate('/vendas');

                break;

                case 201:

                    Swal.update({
                        icon: 'success',
                        title: 'Sucesso',
                        text: 'A venda foi cadastrada!',
                        showConfirmButton: true,
                        allowOutsideClick: true,
                        allowEscapeKey: true
                    });

                    navigate('/vendas');

                break;

                case 206:

                    Swal.update({
                        icon: 'success',
                        title: 'Sucesso',
                        text: 'As informações foram atualizadas! Porém os produtos não foram atualizadas corretamente.',
                        showConfirmButton: true,
                        allowOutsideClick: true,
                        allowEscapeKey: true
                    });

                    navigate('/vendas');

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
                        text: 'A venda informada não foi encontrada!',
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
                <h1>{ acaoPagina } Venda</h1>
            </div>
        </div>
        <div className="row mb-2">
            <div className="col-12 col-md-6">
                <div className="form-group">
                    <label>
                        Cliente
                    </label>
                    <input type="text" className="form-control" value={nomeCliente} onChange={ (e) => { setNomeCliente(e.target.value); }} />
                </div>
            </div>
            <div className="col-12 col-md-6">
                <div className="form-group">
                    <label>
                        Valor Total
                    </label>
                    <input type="text" className="form-control" value={valorVenda} onChange={ (e) => { setValorVenda(e.target.value); }} />
                </div>
            </div>
        </div>
        <div className="row mb-2">
            <div className="col-12 mb-1">
                <div className="form-group">
                    <label>
                        Produtos
                    </label>
                    <select className="form-control" onChange={ (e) => {

                        let auxProdutos = produtos.map( (produto) => {

                            if(produto.id == e.target.value){

                                produto.selected = true;

                            }
                            
                            return produto;
                        
                        } );

                        setProdutos(auxProdutos);

                    }}>
                        <option value="">
                            Adicionar um produto
                        </option>
                        { produtos.filter( (produto) => !produto.selected ).map( (produto) => {

                            return (
                            <option key={`opt-produto-${produto.id}`} value={produto.id}>
                                {produto.description}
                            </option>
                            );

                        } ) }
                    </select>
                </div>
            </div>
            { produtos.filter( (produto) => produto.selected ).map( (produto) => {

                return (
                <div key={`bloco-produto-${produto.id}`} className="col-12">
                    <div className="card p-2">
                        <div className="row align-items-center">
                            <div className="col-12 col-lg-7">
                                <h4 className="m-0">
                                    {`${produto.description} - ${moneyFormatter.format(produto.price)}`}
                                </h4>
                            </div>
                            <div className="col-12 col-lg-3">
                                <input type="number" min="1" defaultValue={produto?.quantity??1} className="form-control" onChange={ (e) => {

                                    setProdutos(produtos.map( (p) => {

                                        if(p.id == produto.id){

                                            p.quantity = parseInt(e.target.value);

                                        }

                                        return p;

                                    } ));

                                } }/>
                            </div>
                            <div className="col-12 col-lg-2 text-end">
                                <button className="btn btn-danger" onClick={() => {

                                    setProdutos(produtos.map((p) => {

                                        if(p.id == produto.id){

                                            p.selected = false;

                                        }

                                        return p;

                                    }));

                                }}>
                                    <FontAwesomeIcon icon={ faTrash }/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>)

            } ) }
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

export default Venda;