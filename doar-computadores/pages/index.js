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
  let [isApiAlive, setIsAPIAlive] = useState(false);
  useEffect(()=>{
     getIsAPIAlive().then(result => {setIsAPIAlive(result)})
  }, [])
 

  return (
    <div className={styles.container}>
        <h1>Doação de Computadores Usados</h1>
        {isApiAlive? <p>API Online</p>: <p>API Offline</p>}
    </div>
  )
}
