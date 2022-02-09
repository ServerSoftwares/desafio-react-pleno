import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faDollarSign, faTags } from '@fortawesome/free-solid-svg-icons';

import { Link } from 'react-router-dom';

function Sidebar(){

    return(
    <div className="sidebar active">
        <Link to="/categorias" className="link">
            <div className="icon-wrapper">
                <FontAwesomeIcon icon={faTags} />
            </div>
            Categorias
        </Link>
        <Link to="/produtos" className="link">
            <div className="icon-wrapper">
                <FontAwesomeIcon icon={faBox} />
            </div>
            Produtos
        </Link>
        <Link to="/vendas" className="link">
            <div className="icon-wrapper">
                <FontAwesomeIcon icon={faDollarSign} />
            </div>
            Vendas
        </Link>
    </div>
    );

}

export default Sidebar;