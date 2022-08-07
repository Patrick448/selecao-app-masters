import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import  {getZipApi, sendData, getIsAPIAlive} from '../utils/api'
import DeviceDataForm from '../components/deviceDataForm';
import FormField from '../components/formField';


export default function Home() {
  const [isApiAlive, setIsAPIAlive] = useState(false);
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


//popula lista de dispositivos a serem doados, com a quatidade dada por num
  const createDevicesList = (num) => {
    let arrayList = []

    for (let i = 0; i < num; i++) {
      arrayList.push({ type: null, condition: null })
      setDeviceList(arrayList)
    }
  }

//chamada quando algum item do formulário de dispositivos muda
  const onDeviceFormItemChange = (event, index) => {
    console.log(event.target.value)
    const arrayList = [...deviceList]
    arrayList[index][event.target.name] = event.target.value;
    setDeviceList(arrayList)
    console.log(deviceList)
  }


//transfere dados recebidos da API do CEP para o formulário
  const loadZipDataToForm = (data) => {

    const newFormState = { ...formState };

    newFormState.state = { value: data.uf, editted: true, valid: true }
    newFormState.neighborhood = { value: data.bairro, editted: true, valid: true }
    newFormState.city = { value: data.localidade, editted: true, valid: true }
    newFormState.streetAddress = { value: data.logradouro, editted: true, valid: true }
    newFormState.complement = { value: data.complemento, editted: true, valid: true }


    setFormState(newFormState)
    document.getElementById("number").focus()

  }

//chama a API do CEP, chamada quando o campo CEP muda
  const handleZipChange = () => {

    if (formState.zip.valid && formState.zip.editted) {
      setLoadingZip(true);
      setZipError(false)
      getZipApi(formState.zip.value)
        .then((data) => {
          if (data != null) {
            setZipError(false);
            loadZipDataToForm(data);
          } else {
            setZipError(true);
          }

        })
        .finally(() => { setLoadingZip(false); })
    }

  }



  //faz o envio dos dados, verificando antes se o formulário está com dados válidos
  const handleSubmit = (event) => {
    event.preventDefault()
    if (checkFieldsValid()) {
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
    }


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
    }else{
      newFormState[inputName].valid = true;
    }

    newFormState[inputName].value = inputValue;
    newFormState[inputName].editted = true;

    setFormState(newFormState)

    console.log(newFormState)

  }

  //verifica se estado do formulário, retornando se é valido ou não e ativando mensagem de erro
  const checkFieldsValid = () => {

    const newFormState = { ...formState };
    const formValid = true;

    for (const property in formState) {
      if (formState[property].valid == false) {
        formValid = false;

      }
    }

    if (formValid == false) {
      setFormState(newFormState)
      setError(true)
      setMessage("Erro: Há campos inválidos no formulário. Verifique os dados.")    
    }

    return formValid;
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

            <FormField
              name="name"
              label="Nome"
              placeholder="Digite aqui seu nome"
              required={true}
              value={formState.name.value} />

            <FormField
              name="email"
              label="E-mail (opcional)"
              placeholder="Digite aqui seu e-mail"
              required={false}
              value={formState.email.value}
              error={formState.email.editted && !formState.email.valid}
              errorMessage="E-mail inválido"
            />

            <FormField
              name="phone"
              label="Telefone"
              placeholder=""
              required={true}
              value={formState.phone.value}
              error={formState.phone.editted && !formState.phone.valid}
              errorMessage="Número de telefone inválido"
            />

            <FormField
              label="CEP"
              name="zip"
              error={(zipError || (formState.zip.editted && !formState.zip.valid))}
              placeholder=""
              value={formState.zip.value}
              errorMessage="CEP inválido"
              onChange={(e) => { handleFormChange(e); handleZipChange(e) }} />

            <div className='success'>{loadingZip ? "Carregando endereço" : ""}</div>

            <div className='formSection'>
              <FormField
                name="city"
                label="Cidade"
                placeholder=""
                required={true}
                value={formState.city.value}
              />
              <FormField
                name="state"
                label="Estado"
                placeholder=""
                required={true}
                value={formState.state.value}
              />

            </div>

            <div className='formSection'>

              <FormField
                name="streetAddress"
                label="Nome do logradouro"
                placeholder=""
                required={true}
                value={formState.streetAddress.value}
              />

              <FormField
                name="number"
                label="Número"
                placeholder=""
                required={true}
                value={formState.number.value}
              />
            </div>

            <FormField
              name="complement"
              label="Complemento (opcional)"
              placeholder=""
              required={false}
              value={formState.complement.value}
            />

            <FormField
              name="neighborhood"
              label="Bairro"
              placeholder=""
              required={true}
              value={formState.neighborhood.value}
            />

            <div className='formSection'>

              <FormField
                name="deviceCount"
                label="Número de doações"
                placeholder=""
                required={true}
                value={formState.deviceCount.value}
                error={formState.deviceCount.editted && !formState.deviceCount.valid}
                errorMessage="Quantidade inválida"
              />

              <div className='label-input-field'>
                <button type="button" onClick={() => createDevicesList(formState.deviceCount.value)}>Continuar</button>
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
