import { useEffect, useState, useMemo } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import CustomTable from '../components/CustomTable/CustomTable';
import Swal from 'sweetalert2';

import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

function Vendas(){

    const [ vendas, setVendas ] = useState([]);

    const moneyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    useEffect( async () => {

        let vendasRetornadas = [];
        
        vendasRetornadas = await fetch(`http://localhost:3000/sales`)
        .then((data) => data.json() )
        .then(data => data.map((venda => { 
            
            return {...venda};
        
        })));

        setVendas(vendasRetornadas);

    }, []);

    function excluirVenda(id){

        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: 'Deseja excluir a venda? Esta ação é irreversível!',
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
                    text: 'A venda está sendo excluída...',
                    showConfirmButton: false,
                    showCancelButton: false
                });

                fetch(`http://localhost:3000/sales/${id}`, {
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
                                text: 'A venda foi excluída!',
                                showConfirmButton: true,
                                allowOutsideClick: true,
                                allowEscapeKey: true
                            });

                            setVendas(await fetch(`http://localhost:3000/sales`)
                            .then((data) => data.json() )
                            .then(data => data.map((venda => { 
                                
                                return {...venda};
                            
                            }))));

                        break;

                        case 400:

                            Swal.update({
                                icon: 'error',
                                title: 'Atenção',
                                text: 'Houve um erro ao excluír a venda!',
                                showConfirmButton: true,
                                allowOutsideClick: true,
                                allowEscapeKey: true
                            });

                        break;

                        case 404:

                            Swal.update({
                                icon: 'error',
                                title: 'Atenção',
                                text: 'A venda não foi encontrada para exclusão!',
                                showConfirmButton: true,
                                allowOutsideClick: true,
                                allowEscapeKey: true
                            });

                        break;

                        case 424:

                            Swal.update({
                                icon: 'error',
                                title: 'Atenção',
                                text: 'Houve um erro ao excluir as relações da venda!',
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
            Header: 'Cliente',
            accessor: 'clientname'
          },
          {
            Header: 'Valor Total',
            accessor: 'totalamount',
            Cell: props => moneyFormatter.format(props.value)
          },
          {
            Header: 'Ações',
            accessor: 'id',
            disableFilters: true,
            disableSortBy: true,
            Cell: props => 
            <div className="text-end">
                <Button className="btn btn-danger me-2" onClick={() => excluirVenda(props.value)}>
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
                <Link to={`/venda/${props.value}`} className="btn btn-primary">
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
                    <h1>Vendas</h1>
                    <Link className="btn btn-primary" to="/venda">
                        Criar Venda
                    </Link>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <CustomTable columns={columns} data={vendas} />
            </div>
        </div>
    </div>
    )

}

export default Vendas;