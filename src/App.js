import logo from './eth-logo.svg';
import './App.css';
import Web3 from 'web3';
import {
  useState,
  useEffect
} from 'react'


function App(){

  const [wallet, setWallet] = useState();
  const web3 = new Web3(Web3.givenProvider || 'HTTP://127.0.0.1:7545');
  // const web3 = new Web3('https://rinkeby.infura.io/v3/ce0f9efff6e841d38024af6712479c6d');
  const [importAddress, setImportAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [activeAccount, setActiveAccount] = useState('');
  const [activeAddress, setActiveAddress] = useState('');
  const [walletAccounts , setWalletAccounts] = ([]);
  const [accountBalance, setAccountBalance] = useState();
  const [transactionsHTML, setTransactionsHTML] = useState('');
  const [cuentasHTML, setCuentasHTML] = useState('');

  useEffect(async() => {
    await loadWeb3();

    await activeAccountInit();

    await loadWallet();
  },[]);

  const loadWeb3 = async () => { 
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('Non-Ethereum browser detected.')
    }
  }

  const loadWallet = async() => {
    let tempWallet = web3.eth.accounts.wallet;
    if(localStorage.getItem('web3js_wallet') != null){
      tempWallet = tempWallet.load('test');
      console.log(tempWallet, "si hay");
    }else{
      tempWallet = tempWallet.create();
      web3.eth.accounts.wallet = tempWallet;
      //private key de una cuenta con ETH
      let importedAccount = web3.eth.accounts.privateKeyToAccount('97b20234d985013c5a5af7df0ec6d0c7d92e174a5d4ebf7b9e970300bd915d0c');
      web3.eth.accounts.wallet.add(importedAccount);
      web3.eth.accounts.wallet.save('test');
      console.log(tempWallet, "no hay");
      setWalletAccounts(walletAccounts.push({index:'0',address:'0xd2BDF00c5b3A57C04dab6b3F2841f658060205fF'}));
      
    }  
    setWallet(tempWallet);

    let json = await JSON.parse(localStorage.getItem('web3js_wallet'));
    let a = await json[localStorage.getItem('active_acc')].address;
    let b = `0x${a}`;
    localStorage.setItem('active_add', b);

    let balance = await getBalance(b).then((data => data));
    let transactions = await getMyTransactions(b).then((data => data));

    if(transactions == ''){
      transactions = 'No se han hecho transacciones todavia';
    }
    setTransactionsHTML(transactions);
    setAccountBalance(balance);
    setActiveAddress(b);

    let selectHTML = '';
    json.map((data, i) => {
      // console.log(i, `0x${data.address}`);
      selectHTML += `<option value="${i}">0x${data.address}</option>`;
    })
    setCuentasHTML(selectHTML);

    let aa = localStorage.getItem('active_acc');
    setActiveAccount(aa);
  }

  const activeAccountInit = async() => {
    if(localStorage.getItem('active_acc') != null){
      console.log('ya hay cuenta activa');
    }else{
      localStorage.setItem('active_acc', 0);
      console.log('se inicializo la cuenta');
    }
  }

  const createAccountHandle = () => {
    web3.eth.accounts.wallet = wallet;
    let newAccount = web3.eth.accounts.create();
    web3.eth.accounts.wallet.add(newAccount);
    web3.eth.accounts.wallet.save('test');
    setWallet(web3.eth.accounts.wallet);
    // setNumAccounts(numAccounts+1);
    console.log(wallet);
  }

  const importAccountHandle = (privateKey) => {
    web3.eth.accounts.wallet = wallet;
    let importedAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(importedAccount);
    web3.eth.accounts.wallet.save('test');
    setWallet(web3.eth.accounts.wallet);
    // setNumAccounts(numAccounts+1);
    setImportAddress('');
    console.log(wallet);
  }

  const setActiveAccountHandle =  () =>{
    localStorage.setItem('active_acc', activeAccount);
  }

  const getMyTransactions = async(address) => {
    let transactions = await getTransactionList(address);
    return transactions;
  };

  const getBalance = async(a) =>{
    let addr = await web3.eth.getBalance(a);
    return web3.utils.fromWei(addr,'ether');
  } 

  const transferEther = async() =>{
    let fromAddress = localStorage.getItem('active_add');
    await web3.eth.sendTransaction({to:toAddress, from:fromAddress, value:web3.utils.toWei(transferAmount, "ether")})
  }

  const getTransactionList = async(_address) =>{
    let block = await web3.eth.getBlock('latest');
    let number = block.number;
    let html = '';

    if (block != null && block.transactions != null) {
        for (let txHash of block.transactions) {
            let tx = await web3.eth.getTransaction(txHash);
            // console.log(tx);

            if (tx.from != undefined && _address.toLowerCase() == tx.from.toLowerCase()) {
              console.log('de mi');  
              // console.log("from: " + tx.from.toLowerCase() + " to: " + tx.to.toLowerCase() + " value: " + tx.value); 
              html += `<p class='p-transactions'><span>FROM:</span> ${tx.from.toLowerCase()} <span>TO:</span> ${tx.to.toLowerCase()}  <span>VALUE:</span> ${web3.utils.fromWei(tx.value, 'ether')} ETH</p>`;               
            }
            if (tx.to != undefined && _address.toLowerCase() == tx.to.toLowerCase()) {
              console.log('para ti');
              // console.log("from: " + tx.from.toLowerCase() + " to: " + tx.to.toLowerCase() + " value: " + tx.value);
              html += `<p class='p-transactions'><span>FROM:</span> ${tx.from.toLowerCase()} <span>TO:</span> ${tx.to.toLowerCase()} <span>VALUE:</span> ${web3.utils.fromWei(tx.value, 'ether')} ETH</p>`; 
          }
        }
    }

    return html;
  }

  return (
    <div className="App">
      <div className="app-content">
        {/* <Navbar wallet={wallet} getWalletAccounts={getWalletAccounts} /> */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="">Ethereum Wallet</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item ">
                <a className="nav-link create-a" href="" onClick={() => createAccountHandle()}>Crear Cuenta </a>
              </li>
              <li className="nav-item">
                <div id='div-seta'>
                  <span><a id='a-seta' className="nav-link" href="" onClick={() => setActiveAccountHandle(activeAccount)}>Cambiar Cuenta</a></span>
                  <select value={activeAccount} onChange={e => setActiveAccount(e.target.value)} name="mis-cuentas" id="cuentas-select" className="cuentas-select" dangerouslySetInnerHTML={{ __html: cuentasHTML }}></select>
                  {/* <input id='input-seta' value={activeAccount} onInput={e => setActiveAccount(e.target.value)}/> */}
                </div>
                
              </li>
              <li className="nav-item">
                <div id='div-import'>
                  <span><a id='a-import' className="nav-link" href="" onClick={() => importAccountHandle(importAddress)}>Importar Cuenta</a></span>
                  <input id='input-import' value={importAddress} onInput={e => setImportAddress(e.target.value)}/>
                </div>
                
              </li>
              <li className="nav-item">
                <button type="button" id='exportar-btn' className="btn btn-outline-primary" onClick={() => alert(`Tu llave privada es: ${wallet[activeAccount].privateKey}`)}>Exportar Llave Privada</button>
              </li>
            </ul>
          </div>
        </nav>
        <div className="all-content">
            <div className="logo">
              <img src={logo} className="app-logo" alt="logo" />
              <div className="balance">
               {accountBalance}  ETH
              </div>
              <p>{activeAddress}</p>
            </div>
            <div className="transfer">
              <form onSubmit = {(event) => {
                  event.preventDefault();
                  transferEther();
                }}>
                  <div className="form-group mr-sm-2">
                      <input value={toAddress} onInput={e => setToAddress(e.target.value)} className="form-control" type="text" placeholder="Direccion Destinatario" required/>
                  </div>
                  <div className="form-group mr-sm-2">
                      <input value={transferAmount} onInput={e => setTransferAmount(e.target.value)} type="text" className="form-control" placeholder="Monto" required/>
                  </div>

                  <button type="submit" className = "submitButton btn btn-primary btn-block">Send</button>
              </form>
            </div>
            <div className="more">
              <div className="btn-more">
               <span>ULTIMA TRANSACCION REALIZADA</span>
              </div>
              <div dangerouslySetInnerHTML={{ __html: transactionsHTML }}  className="transactions" />
            </div> 
            
            
        </div>
        
      </div>
    </div>
  );
}

export default App;
