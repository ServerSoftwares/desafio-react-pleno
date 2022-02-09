import { useEffect, useState, useMemo } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import CustomTable from '../components/CustomTable/CustomTable';
import Swal from 'sweetalert2';

import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

function Categorias(){

    const [ categorias, setCategorias ] = useState([]);

    useEffect( async () => {

        let categoriasRetornadas = [];
        
        categoriasRetornadas = await fetch(`http://localhost:3000/categories`)
        .then((data) => data.json() )
        .then(data => data.map((categoria => { 
            
            return {...categoria, display: true};
        
        })));

        setCategorias(categoriasRetornadas);

    }, []);

    function excluirCategoria(id){

        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: 'Deseja excluir a categoria? Esta ação é irreversível!',
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
                    text: 'A categoria está sendo excluída...',
                    showConfirmButton: false,
                    showCancelButton: false
                });

                fetch(`http://localhost:3000/categories/${id}`, {
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
                                text: 'A categoria foi excluída!',
                                showConfirmButton: true,
                                allowOutsideClick: true,
                                allowEscapeKey: true
                            });

                            setCategorias(await fetch(`http://localhost:3000/categories`)
                            .then((data) => data.json() )
                            .then(data => data.map((categoria => { 
                                
                                return {...categoria, display: true};
                            
                            }))));

                        break;

                        case 400:

                            Swal.update({
                                icon: 'error',
                                title: 'Atenção',
                                text: 'Houve um erro ao excluír a categoria!',
                                showConfirmButton: true,
                                allowOutsideClick: true,
                                allowEscapeKey: true
                            });

                        break;

                        case 404:

                            Swal.update({
                                icon: 'error',
                                title: 'Atenção',
                                text: 'A categoria não foi encontrada para exclusão!',
                                showConfirmButton: true,
                                allowOutsideClick: true,
                                allowEscapeKey: true
                            });

                        break;

                        case 424:

                            Swal.update({
                                icon: 'error',
                                title: 'Atenção',
                                text: 'Houve um erro ao excluir as relações da categoria!',
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
            Header: 'Ações',
            accessor: 'id',
            disableFilters: true,
            disableSortBy: true,
            Cell: props => 
            <div className="text-end">
                <Button className="btn btn-danger me-2" onClick={() => excluirCategoria(props.value)}>
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
                <Link to={`/categoria/${props.value}`} className="btn btn-primary">
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
                    <h1>Categorias</h1>
                    <Link className="btn btn-primary" to="/categoria">
                        Criar Categoria
                    </Link>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <CustomTable columns={columns} data={categorias} />
            </div>
        </div>
    </div>
    )

}

export default Categorias;