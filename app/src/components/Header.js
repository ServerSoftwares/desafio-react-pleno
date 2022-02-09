import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

function Header(){

   return (
    <header className="header">
        <span>
            Dashboard
        </span>
        <div className="sidebar-toggler">
            <FontAwesomeIcon icon={faBars} className="icon open" />
            <FontAwesomeIcon icon={faTimes} className="icon close" />
        </div>
    </header>
   )

}

export default Header;