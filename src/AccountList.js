const AccountList = ({wallet}) => {
    return ( 
        <div className="accountsTable">
            <table className="table">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Account</th>
                    <th scope="col">Balance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    </tr>
                </tbody>
                </table>
        </div>
     );
}
 
export default AccountList;