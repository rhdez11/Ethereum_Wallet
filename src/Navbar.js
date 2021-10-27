const Navbar = ({wallet}) => {
    return ( 
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="">Ethereum Wallet</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="#">Crear Cuenta </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Importar Cuenta</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Dropdown link
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                {() => {
                  for(let i=0; i<2; i++){
                    <a className="dropdown-item" href="">{}</a>
                  }
                }}                  
              </div>
            </li>
          </ul>
        </div>
      </nav>
     );
}
 
export default Navbar;
