  
  //Componente contendo input, label e mensagem de erro para uma entrada de dados
  export default function FormField (props) {
  
    return <div className='fill label-input-field'>
      <label htmlFor={props.name}>{props.label}</label>
      <input type="text" id={props.name} name={props.name} placeholder={props.placeholder} value={props.value} required={props.required} onChange={props.onChange} />
      <div className='error'>{props.error == true ? props.errorMessage : ""}</div>
    </div>
  }
  