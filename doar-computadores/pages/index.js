import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import { useState, useEffect } from 'react';

const apiAddess = "https://api-doar-computadores.herokuapp.com"
const donationRoute = apiAddess + "/donation"

async function getIsAPIAlive() {
  const response = await axios.get(apiAddess);
  return response.data.alive;
}

async function sendData(data) {

  try {
    const response = await axios.post(donationRoute, data);
  }
  catch (e) {

    if (e.response.request.status == 400) {
      throw new Error(e.response.data.errorMessage)
    }
    else {
      throw new Error("Houve um erro ao enviar. Tente novamente.")
    }


  }

}

async function getZipApi(zipCode) {

  try {
    const response = await axios.get(`https://viacep.com.br/ws/${zipCode}/json`);
    console.log(response.data)

    if (response.data.erro == 'true') {
      return null;
    }

    return response.data;
  }
  catch (e) {
    return null
  }



}

export default function Home() {
  const [isApiAlive, setIsAPIAlive] = useState(false);
  const [deviceCount, setDeviceCount] = useState("");
  const [deviceList, setDeviceList] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loadingZip, setLoadingZip] = useState(false);
  const [zipError, setZipError] = useState(false);


  const types = [
    { displayName: "Notebook", id: "notebook" },
    { displayName: "Desktop", id: "desktop" },
    { displayName: "Netbook", id: "netbook" },
    { displayName: "Monitor", id: "screen" },
    { displayName: "Impressora", id: "printer" },
    { displayName: "Scanner", id: "scanner" },
  ];
  const conditions = [
    { displayName: "Tem todas as partes, liga e funciona normalmente", id: "working" },
    { displayName: "Tem todas as partes, mas não liga mais", id: "notWorking" },
    { displayName: "Faltam peças, funciona só as vezes ou está quebrado", id: "broken" }
  ]

  useEffect(() => {
    getIsAPIAlive().then(result => { setIsAPIAlive(result) })
  }, [])

  const handleDeviceCountChange = (event) => {
    let num = event.target.value;
    console.log(num);
    setDeviceCount(num);


  }

  const showDevicesForm = (num) => {

    let arrayList = []

    for (let i = 0; i < num; i++) {
      arrayList.push({ type: null, condition: null })
      setDeviceList(arrayList)
    }
  }


  const onDeviceFormItemChange = (event, index) => {
    console.log(event.target.value)
    const arrayList = [...deviceList]
    arrayList[index][event.target.name] = event.target.value;
    setDeviceList(arrayList)
    console.log(deviceList)
  }

  const DeviceDataForm = (props) => {
    let item = props.item
    let index = props.index
    console.log("Building form item")
    console.log(item)

    return <div className="box-1" key={index}>

      <div className='label-input-field'>
        <label htmlFor="type">Tipo de equipamento</label>
        <select required defaultValue="none" value={item.type == null ? "none" : item.type} name="type" id="type" form="donation-form" onChange={(e) => onDeviceFormItemChange(e, index)}>
          <option disabled value="none"> -- selecione uma opção -- </option>
          {types.map((item) => <option value={item.id}>{item.displayName}</option>)}
        </select>
      </div>
      <div className='label-input-field'>

        <label htmlFor="condition">Condição</label>
        <select required defaultValue="none" value={item.condition == null ? "none" : item.condition} name="condition" id="condition" form="donation-form" onChange={(e) => onDeviceFormItemChange(e, index)}>
          <option disabled value="none"> -- selecione uma opção -- </option>
          {conditions.map((item) => <option key={item.id} value={item.id}>{item.displayName}</option>)}
        </select>
      </div>
    </div>
  }

  const loadZipDataToForm = (data) => {
    document.getElementById("state").value = data.uf
    document.getElementById("neighborhood").value = data.bairro
    document.getElementById("city").value = data.localidade
    document.getElementById("streetAddress").value = data.logradouro
    document.getElementById("number").focus()

  }


  const handleZipChange = (event) => {

    if (event.target.value.length == 8) {
      setLoadingZip(true);
      setZipError(false)
      getZipApi(event.target.value)
        .then((data) => {
          if (data != null) {
            loadZipDataToForm(data);
          } else {
            setZipError(true);
          }

        })
        .finally(() => { setLoadingZip(false); })
    }

  }


  const handleSubmit = (event) => {
    event.preventDefault()


    const data = {
      name: event.target.name.value,
      email: event.target.email.value,
      phone: event.target.phone.value,
      zip: event.target.zip.value,
      city: event.target.city.value,
      state: event.target.state.value,
      streetAddress: event.target.streetAddress.value,
      number: event.target.number.value,
      complement: event.target.complement.value,
      neighborhood: event.target.neighborhood.value,
      deviceCount: parseInt(deviceCount),
      devices: deviceList
    }

    sendData(data)
      .then(() => {
        setMessage("Dados enviados com sucesso");
        setError(false)
      })
      .catch((e) => {
        setMessage(e.message);
        setError(true)
      })
    getZipApi(event.target.zip.value)
  }

  return (
    <div className='container'>
      <div className='header'>
          <Image src="/computer-heart-icon.svg"  height={100} width={100} />
          <div className='header-text'>
            <h1>Doação de Computadores Usados</h1>
            {isApiAlive ? <p>API Online</p> : <p>API Offline</p>}
          </div>
      </div>
      <form id="donation-form" onSubmit={handleSubmit}>
        <div className='form-container'>
          <div className="box-1">
            <h2>Dados do doador</h2>

            <div className='label-input-field'>
              <label htmlFor="name">Nome</label>
              <input type="text" id="name" name="name" required></input>
            </div>

            <div className='label-input-field'>
              <label htmlFor="email">E-mail</label>
              <input type="text" id="email" name="email" pattern='/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/'></input>
            </div>

            <div className='label-input-field'>
              <label htmlFor="phone">Telefone</label>
              <input type="text" id="phone" name="phone" required></input>
            </div>

            <div className='label-input-field'>
              <label htmlFor="zip">CEP</label>
              <input type="text" maxLength={9} id="zip" name="zip" onChange={handleZipChange} required></input>
            </div>

            <div className='success'>{loadingZip ? "Carregando endereço" : ""}</div>
            <div className='error'>{zipError ? "CEP inválido" : ""}</div>

            <div className='formSection'>
              <div className='fill label-input-field'>
                <label htmlFor="city">Cidade</label>
                <input type="text" id="city" name="city" required></input>
              </div>
              <div className='fill label-input-field'>
                <label htmlFor="state">Estado</label>
                <input type="text" id="state" name="state" required></input>
              </div>

            </div>

            <div className='formSection'>

              <div className='fill label-input-field'>
                <label htmlFor="streetAddress">Nome do logradouro</label>
                <input type="text" id="streetAddress" name="streetAddress" required></input>
              </div>

              <div className='fill label-input-field'>
                <label htmlFor="number">Número</label>
                <input type="text" id="number" name="number" required></input>
              </div>

            </div>

            <div className='label-input-field'>
              <label htmlFor="complement">Complemento</label>
              <input type="text" id="complement" name="complement"></input>
            </div>

            <div className='label-input-field'>
              <label htmlFor="neighborhood">Bairro</label>
              <input type="text" id="neighborhood" name="neighborhood" required></input>
            </div>



            <div className='formSection'>

              <div className='label-input-field fill'>
                <label htmlFor="deviceCount">Número de doações</label>
                <input type="number" onChange={handleDeviceCountChange} id="deviceCount" name="deviceCount" required />
              </div>
              <div className='label-input-field'>
                <button type="button" onClick={() => showDevicesForm(deviceCount)}>Continuar</button>
              </div>
            </div>

          </div>
        </div>
        <div className={`form-container ${deviceList.length > 0 ? "show" : "hide"}`}>
          <div className='sub-header-container'>
            <h2>Dados das doações</h2>
          </div>
          {deviceList.map((item, index) => { console.log("mapped: " + item); return <DeviceDataForm item={item} index={index} /> })}
          <p className={`message ${error ? "error" : "success"}`}>{message}</p>
          <button type="submit">Enviar</button>
        </div>

      </form>
    </div>
  )
}


