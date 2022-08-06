import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import { useState, useEffect } from 'react';
import Link from 'next/link';


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
  const [formState, setFormState] = useState(
    {
      name: { value: "", editted: false, valid: false },
      email: { value: "", editted: false, valid: false },
      phone: { value: "", editted: false, valid: false },
      zip: { value: "", editted: false, valid: false },
      city: { value: "", editted: false, valid: false },
      state: { value: "", editted: false, valid: false },
      streetAddress: { value: "", editted: false, valid: false },
      number: { value: "", editted: false, valid: false },
      complement: { value: "", editted: false, valid: false },
      neighborhood: { value: "", editted: false, valid: false },
      deviceCount: { value: "", editted: false, valid: false },
      devices: []
    })

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



  const loadZipDataToForm = (data) => {

    const newFormState = { ...formState };

    newFormState.state = { value: data.uf, editted: true, valid: true }
    newFormState.neighborhood = { value: data.bairro, editted: true, valid: true }
    newFormState.city = { value: data.localidade, editted: true, valid: true }
    newFormState.streetAddress = { value: data.logradouro, editted: true, valid: true }

    setFormState(newFormState)
    document.getElementById("number").focus()

  }


  const handleZipChange = (event) => {

    if (event.target.value.length >= 8) {
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
    checkFieldsValid()

    const data = {
      name: formState.name.value,
      email: formState.email.value,
      phone: formState.phone.value,
      zip: formState.zip.value,
      city: formState.city.value,
      state: formState.state.value,
      streetAddress: formState.streetAddress.value,
      number: formState.number.value,
      complement: formState.complement.value,
      neighborhood: formState.neighborhood.value,
      deviceCount: parseInt(formState.deviceCount.value),
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
    getZipApi(formState.zip.value)
  }

  //valida campos do formulário de dados pessoais
  //o patern decide se o formato está correto, o filter verifica cada caracter, permitindo a inserção ou não
  const handleFormChange = (event) => {
    console.log(event)
    const inputName = event.target.name;
    const inputValue = event.target.value;
    const newFormState = { ...formState };

    const validations = {
      email: { pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, filter: /.*/ },
      phone: { pattern: /^[0-9]{10,11}$/, filter: /^[0-9]*$/ },
      zip: { pattern: /^[0-9]{5}\-?[0-9]{3}$/, filter: /^[0-9]*\-?[0-9]*$/ },
      number: { pattern: /^[0-9]*$/, filter: /^[0-9]*$/ },
      deviceCount: { pattern: /^[0-9]*$/, filter: /^[0-9]*$/ }
    }

    if (validations[inputName] != undefined) {

      if (!validations[inputName].filter.test(inputValue)) {
        console.log(inputValue + " typed")
        return;
      }

      console.log(validations[inputName]);
      const valid = validations[inputName].pattern.test(inputValue);
      console.log("valid " + inputName + ": " + valid);
      newFormState[inputName].valid = valid;
    }

    newFormState[inputName].value = inputValue;
    newFormState[inputName].editted = true;

    setFormState(newFormState)

    console.log(newFormState)

  }

  const checkFieldsValid =()=>{

    for (const item in Object.entries(formState)) {
      console.log(item)
    }
  }

  

  return (
    <div className='container'>
      <div className='header'>
        <Image src="/computer-heart-icon.svg" height={100} width={100} />
        <div className='header-text'>
          <h1>Doação de Computadores Usados</h1>
          <div className='header-sub-text row'>
            <div className='header-menu-item'>
              {isApiAlive ? <p>API Online</p> : <p>API Offline</p>}
            </div>
            <div className='header-menu-item'>
              <p>
                <Link href="/institutions">
                  <a>Instituições</a>
                </Link>
              </p>
            </div>
          </div>

        </div>

      </div>
      <form id="donation-form" onSubmit={handleSubmit} onChange={handleFormChange}>
        <div className='form-container'>
          <div className="box-1">
            <h2 className='form-header'>Dados do doador</h2>

            <div className='label-input-field'>
              <label htmlFor="name">Nome</label>
              <input type="text" id="name" name="name" placeholder="Seu nome completo" value={formState.name.value} required></input>
            </div>
            

            <FormField name="name" label="Nome" placeholder="Digite aqui seu nome" required={true} value={formState.name.value} />
            <div className='label-input-field'>
              <label htmlFor="email">E-mail (opcional)</label>
              <input type="text" id="email" name="email" placeholder="Seu endereço de e-mail" value={formState.email.value} />
              <div className='error'>{formState.email.editted && !formState.email.valid ? "E-mail inválido" : ""}</div>
            </div>

            <div className='label-input-field'>
              <label htmlFor="phone">Telefone</label>
              <input type="text" id="phone" name="phone" placeholder='Seu número de telefone (apenas dígitos)' required value={formState.phone.value}></input>
              <div className='error'>{formState.phone.editted && !formState.phone.valid ? "Número de telefone inválido" : ""}</div>

            </div>

            <FormField
              label="CEP"
              name="zip"
              error={(zipError || (formState.zip.editted && !formState.zip.valid))}
              placeholder=""
              value={formState.zip.value}
              errorMessage="CEP inválido"
              onChange={handleFormChange} />

            <div className='success'>{loadingZip ? "Carregando endereço" : ""}</div>

            <div className='formSection'>
              <div className='fill label-input-field'>
                <label htmlFor="city">Cidade</label>
                <input type="text" id="city" name="city" required value={formState.city.value}></input>
              </div>
              <div className='fill label-input-field'>
                <label htmlFor="state">Estado</label>
                <input type="text" id="state" name="state" required value={formState.state.value}></input>
              </div>

            </div>

            <div className='formSection'>

              <div className='fill label-input-field'>
                <label htmlFor="streetAddress">Nome do logradouro</label>
                <input type="text" id="streetAddress" name="streetAddress" required value={formState.streetAddress.value}></input>
              </div>

              <div className='fill label-input-field'>
                <label htmlFor="number">Número</label>
                <input type="text" id="number" name="number" required value={formState.number.value}></input>
                <div className='error'>{formState.number.editted && !formState.number.valid ? "Número inválido" : ""}</div>

              </div>

            </div>

            <div className='label-input-field'>
              <label htmlFor="complement">Complemento (opcional)</label>
              <input type="text" id="complement" name="complement" value={formState.complement.value}></input>
            </div>

            <div className='label-input-field'>
              <label htmlFor="neighborhood">Bairro</label>
              <input type="text" id="neighborhood" name="neighborhood" required value={formState.neighborhood.value}></input>
            </div>

            <div className='formSection'>

              <div className='label-input-field'>
                <label htmlFor="deviceCount">Número de doações</label>
                <input type="text" id="deviceCount" name="deviceCount" value={formState.deviceCount.value} required />
                <div className='error'>{formState.deviceCount.editted && !formState.deviceCount.valid ? "Quantidade inválida" : ""}</div>

              </div>
              <div className='label-input-field'>
                <button type="button" onClick={() => showDevicesForm(formState.deviceCount.value)}>Continuar</button>
              </div>
            </div>

          </div>
        </div> </form>
      <form>
        <div className={`form-container ${deviceList.length > 0 ? "show" : "hide"}`}>

          <div className='box-1'>

            <div className='sub-header-container'>
              <h2>Dados das doações</h2>
            </div>
            {deviceList.map((item, index) =>
              <DeviceDataForm
                types={types}
                conditions={conditions}
                onChange={onDeviceFormItemChange}
                key={index}
                item={item}
                index={index} />
            )}
            <p className={`message ${error ? "error" : "success"}`}>{message}</p>
            <button type="submit" form="donation-form" onSubmit={handleSubmit}>Enviar</button>
          </div>
        </div>
      </form>



    </div>
  )
}

const DeviceDataForm = (props) => {
  let types = props.types
  let conditions = props.conditions
  let donation = props.item
  let index = props.index
  console.log("Building form item")
  console.log(donation)

  return <div className="device-data-box">

    <div className='label-input-field'>
      <label htmlFor="type">Tipo de equipamento</label>
      <select required defaultValue="none" value={donation.type == null ? "none" : donation.type} name="type" id="type" form="donation-form" onChange={(e) => props.onChange(e, index)}>
        <option disabled value="none"> -- selecione um tipo -- </option>
        {types.map((item) => <option key={"type" + item.id + index} value={item.id}>{item.displayName}</option>)}
      </select>
    </div>
    <div className='label-input-field'>

      <label htmlFor="condition">Condição</label>
      <select required defaultValue="none" value={donation.condition == null ? "none" : donation.condition} name="condition" id="condition" form="donation-form" onChange={(e) => props.onChange(e, index)}>
        <option disabled value="none"> -- selecione uma condição -- </option>
        {conditions.map((item) => <option key={"cond" + item.id + index} value={item.id}>{item.displayName}</option>)}
      </select>
    </div>
  </div>
}

const FormField = (props) => {
  //console.log(props)

  return <div className='label-input-field'>
    <label htmlFor={props.name}>{props.label}</label>
    <input type="text" id={props.name} name={props.name} placeholder={props.placeholder} value={props.value} required={props.required} onChange={props.onChange} />
    <div className='error'>{props.error == true ? props.errorMessage : ""}</div>
  </div>
}
