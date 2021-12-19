import { useEffect, useState } from 'react';
import './App.css';
import lottery from './lottery';
import web3 from './web3';

function App() {

    const [Manager, setManager] = useState(' ');
    const [Players, setPlayers] = useState([]);
    const [Balance, setBalance] = useState('');
    const [Value, setValue] = useState();
    const [message, setMessage] = useState('');

    useEffect( () => {

         async function callManager () {
            const manager = await lottery.methods.manager().call(); 
            const players = await lottery.methods.getPlayers().call(); 
            const balance = await web3.eth.getBalance(lottery.options.address);

            setManager(manager);
            setPlayers(players);
            setBalance(balance);
        }

        callManager();   
},[]);

const onSubmit = async (event)=>{
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    
    setMessage("Hey, wait for few seconds .....");
    await lottery.methods.enter().send({
        from:accounts[0],
        value: web3.utils.toWei(Value,'ether')  
    });
    setMessage("Successfully, Entered into Lottery !");
}

const pickWinner = async ()=>{
    
    const accounts = await web3.eth.getAccounts();
    
    setMessage("Hey, wait for few seconds .....");
    
    await lottery.methods.pickWinner().send({
        from:accounts[0]
    });
    setMessage("Winner is picked !");
}

  return (              
    <div>
      <h2>Lottery Contract</h2>
      <p>This Contract is managed by {Manager}</p>
       <p>Number of Players in lottery is {Players.length}</p>
        <h4>Lottery Balance: { web3.utils.fromWei(Balance, 'ether')} </h4>

        <hr></hr>

        <form onSubmit={onSubmit}>
            <h3>Want to try your Luck!</h3>
            <label>Enter a Amount :: </label>
            <input onChange={ (e)=> setValue(e.target.value) } required/>
            <br></br>
            <button>Enter</button>
        </form>
        <hr/>
            <h4>Ready to pick winner !!</h4>
            <button onClick={pickWinner} >Pick a Winner</button>
        <hr/>
        <h2>{message}</h2>
    </div>
  );
}

export default App;
