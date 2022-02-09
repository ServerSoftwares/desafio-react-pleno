import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Swal from 'sweetalert2';

function Categoria(){

    const { idCategoria } = useParams();
    const navigate = useNavigate();
    const [ acaoPagina, setAcaoPagina ] = useState('Cadastrar');

    const [ descricaoCategoria, setDescricaoCategoria ] = useState('');

    const [ acao, setAcao ] = useState('POST');

    useEffect(async () => {

        const categoria = await fetch(`http://localhost:3000/categories`)
        .then(data => data.json())
        .then(data => {

            return data.filter((categoria) => {

                return categoria.id == idCategoria;

            })[0];

        });

        if(categoria !== undefined){

            setAcao('PUT');
            setAcaoPagina('Editar')

            setDescricaoCategoria(categoria.description);

        }

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

                navigate('/categorias');

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

        fetch(`http://localhost:3000/categories${ (acao == 'POST' ? '' : `/${idCategoria}`) }`, {
            method: acao,
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                description: descricaoCategoria
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

                    navigate('/categorias');

                break;

                case 201:

                    Swal.update({
                        icon: 'success',
                        title: 'Sucesso',
                        text: 'A categoria foi cadastrada!',
                        showConfirmButton: true,
                        allowOutsideClick: true,
                        allowEscapeKey: true
                    });

                    navigate('/categorias');

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
                        text: 'A categoria informada não foi encontrada!',
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
                <h1>{ acaoPagina } Categoria</h1>
            </div>
        </div>
        <div className="row mb-2">
            <div className="col-12 col-md-6">
                <div className="form-group">
                    <label>
                        Descrição
                    </label>
                    <input type="text" className="form-control" value={descricaoCategoria} onChange={ (e) => { setDescricaoCategoria(e.target.value); }} />
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

export default Categoria;