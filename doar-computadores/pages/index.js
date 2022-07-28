import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import {useState, useEffect} from 'react';

async function getIsAPIAlive(){
  const response = await axios.get("https://doar-computador-api.herokuapp.com/");
  return response.data.alive;
}

export default function Home() {
  const [isApiAlive, setIsAPIAlive] = useState(false);
  const [deviceCount, setDeviceCount] = useState("");
  const types = [
    {displayName: "Notebook", id:"notebook"},
    {displayName: "Desktop", id:"desktop"},
    {displayName: "Netbook", id:"netbook"},
    {displayName: "Monitor", id:"screen"},
    {displayName: "Impressora", id:"printer"},
    {displayName: "Scanner", id:"scanner"},
];
  const conditions = [  
    {displayName: "Tem todas as partes, liga e funciona normalmente", id:"working"},
    {displayName: "Tem todas as partes, mas não liga mais", id:"working"},
    {displayName: "Faltam peças, funciona só as vezes ou está quebrado", id:"broken"}
  ]
   
  useEffect(()=>{
     getIsAPIAlive().then(result => {setIsAPIAlive(result)})
  }, [])
 
  const handleDeviceCountChange = (event)=>{
    let text = event.target.value;
    console.log(text);
    setDeviceCount(text);
  }

  return (
    <div className={styles.container}>
        <h1>Doação de Computadores Usados</h1>
        {isApiAlive? <p>API Online</p>: <p>API Offline</p>}

        <div class="box-1">
          <h2>Dados do doador</h2>
          <form action="/" method="post" id="donation-form">
          <label for="name">Nome</label>
          <input type="text"  id="name" name="name"></input>
          <label for="e-mail">E-mail</label>
          <input type="text" id="e-mail" name="e-mail"></input>
          <label for="phone">Telefone</label>
          <input type="text" id="phone" name="phone"></input>

          <label for="zip">CEP</label>
          <input type="text" id="zip" name="zip"></input>
          <label for="city">Cidade</label>
          <input type="text" id="city" name="city"></input>
          <label for="state">Estado</label>
          <input type="text" id="state" name="state"></input>
          <label for="streetAdress">Nome do logradouro</label>
          <input type="text" id="streetAdress" name="streetAdress"></input>
          <label for="number">Número</label>
          <input type="text" id="number" name="number"></input>
          <label for="complement">Complemento</label>
          <input type="text" id="complement" name="complement"></input>
          <label for="neighborhood">Bairro</label>
          <input type="text" id="neighborhood" name="neighborhood"></input>
          <label for="deviceCount">Número de doações</label>
          <input type="number" onChange={handleDeviceCountChange} id="deviceCount" name="deviceCount" value={deviceCount}/>
        
        </form>
        </div>



        <div class={`box-1 ${deviceCount>=1? "show": "hide"}`}>
          <h2>Dados das doações</h2>
          <form action="/" method="post">
          <label for="type">Tipo de equipamento</label>
          <select name="type" id="type" form="donation-form">
            {types.map((item)=><option value={item.id}>{item.displayName}</option>)}
          </select>
          <label for="condition">Condição</label>
          <select name="condition" id="condition" form="donation-form">
            {conditions.map((item)=><option value={item.id}>{item.displayName}</option>)}
          </select>
        </form>
        </div>
    
    </div>
  )
}
