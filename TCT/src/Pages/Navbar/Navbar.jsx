import { NavLink } from 'react-router-dom'

export default function NavBar() {

    return (
        <nav className="NavBar"
>
            <ul className="menu">
                <li><NavLink to="/Homepage">Home</NavLink></li>
                <li><NavLink to="/News">News</NavLink></li>

            </ul>
        </nav>
    )
}