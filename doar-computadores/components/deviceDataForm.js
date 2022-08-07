//Componente contendo entradas necessárias para cada doação
export default function DeviceDataForm (props) {
    let types = props.types
    let conditions = props.conditions
    let donation = props.item
    let index = props.index
    console.log("Building form item")
    console.log(donation)
  
    return <div className="device-data-box">
  
      <div className='label-input-field'>
        <label htmlFor="type">Tipo de equipamento</label>
        <select required value={donation.type == null ? "none" : donation.type} name="type" id="type" form="donation-form" onChange={(e) => props.onChange(e, index)}>
          <option disabled value="none"> -- selecione um tipo -- </option>
          {types.map((item) => <option key={"type" + item.id + index} value={item.id}>{item.displayName}</option>)}
        </select>
      </div>
      <div className='label-input-field'>
  
        <label htmlFor="condition">Condição</label>
        <select required value={donation.condition == null ? "none" : donation.condition} name="condition" id="condition" form="donation-form" onChange={(e) => props.onChange(e, index)}>
          <option disabled value="none"> -- selecione uma condição -- </option>
          {conditions.map((item) => <option key={"cond" + item.id + index} value={item.id}>{item.displayName}</option>)}
        </select>
      </div>
    </div>
  }
  
