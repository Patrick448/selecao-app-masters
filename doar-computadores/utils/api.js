import axios from 'axios'

const apiAddess = "https://api-doar-computadores.herokuapp.com"
const donationRoute = apiAddess + "/donation"

export async function getIsAPIAlive() {
  const response = await axios.get(apiAddess);
  return response.data.alive;
}

export async function sendData(data) {

  try {
     await axios.post(donationRoute, data);
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

export async function getZipApi(zipCode) {

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