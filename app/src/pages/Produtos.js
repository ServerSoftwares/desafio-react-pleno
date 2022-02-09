import { useEffect, useState, useMemo } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import CustomTable from '../components/CustomTable/CustomTable';
import Swal from 'sweetalert2';

import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

function Produtos(){

    const [ produtos, setProdutos ] = useState([]);

    const moneyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    useEffect( async () => {

        let produtosRetornados = [];
        
        produtosRetornados = await fetch(`http://localhost:3000/products`)
        .then((data) => data.json() )
        .then(data => data.map((produto => { 
            
            return {...produto, display: true};
        
        })));

        setProdutos(produtosRetornados);

    }, []);

    function excluirProduto(id){

        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: 'Deseja excluir o produto? Esta ação é irreversível!',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            confirmButtonColor: '#dc3545',
            showCancelButton: true,
            cancelButtonText: 'Não',
            cancelButtonColor: '#198754',
            reverseButtons: true,
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((res) => {

            if(res.isConfirmed){

                Swal.fire({
                    icon: 'info',
                    title: 'Aguarde',
                    text: 'O produto está sendo excluído...',
                    showConfirmButton: false,
                    showCancelButton: false
                });

                fetch(`http://localhost:3000/products/${id}`, {
                    method: 'DELETE',
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                })
                .then(async (data) => {

                    switch(data.status){

                        case 200:

                            Swal.update({
                                icon: 'success',
                                title: 'Sucesso',
                                text: 'O produto foi excluído!',
                                showConfirmButton: true,
                                allowOutsideClick: true,
                                allowEscapeKey: true
                            });

                            setProdutos(await fetch(`http://localhost:3000/products`)
                            .then((data) => data.json() )
                            .then(data => data.map((produto => { 
                                
                                return {...produto, display: true};
                            
                            }))));

                        break;

                        case 400:

                            Swal.update({
                                icon: 'error',
                                title: 'Atenção',
                                text: 'Houve um erro ao excluír o produto!',
                                showConfirmButton: true,
                                allowOutsideClick: true,
                                allowEscapeKey: true
                            });

                        break;

                        case 404:

                            Swal.update({
                                icon: 'error',
                                title: 'Atenção',
                                text: 'O produto não foi encontrado para exclusão!',
                                showConfirmButton: true,
                                allowOutsideClick: true,
                                allowEscapeKey: true
                            });

                        break;

                        case 424:

                            Swal.update({
                                icon: 'error',
                                title: 'Atenção',
                                text: 'Houve um erro ao excluir as relações do produto!',
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

                })

            }

        });

    }

    /* Table */

    const columns = useMemo(
        () => [
          {
            Header: 'Descrição',
            accessor: 'description'
          },
          {
            Header: 'Preço',
            accessor: 'price',
            Cell: props => moneyFormatter.format(props.value)
          },
          {
            Header: 'Ações',
            accessor: 'id',
            disableFilters: true,
            disableSortBy: true,
            Cell: props => 
            <div className="text-end">
                <Button className="btn btn-danger me-2" onClick={() => excluirProduto(props.value)}>
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
                <Link to={`/produto/${props.value}`} className="btn btn-primary">
                    <FontAwesomeIcon icon={faPen} />
                </Link>
            </div>
          },
        ],
        []
    );

    return(
    <div className="content">
        <div className="row">
            <div className="col-12">
                <div className="d-flex justify-content-between align-items-center">
                    <h1>Produtos</h1>
                    <Link className="btn btn-primary" to="/produto">
                        Criar Produto
                    </Link>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <CustomTable columns={columns} data={produtos} />
            </div>
        </div>
    </div>
    )

}

export default Produtos;