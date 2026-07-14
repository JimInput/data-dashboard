import { Link } from 'react-router-dom';
import './Sidebar.css'

const Sidebar = () => {
    return (
        <nav>
            <h1>Sidebar</h1>
            <h2><Link to="/pokemon">Pokemon</Link></h2>
            <h2><Link to="/about">About</Link></h2>
            <h2><Link to="/settings">Settings</Link></h2>
        </nav>
    )
}

export default Sidebar;