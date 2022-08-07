import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import { useState, useEffect } from 'react';


export default function InstitutionsList() {

    const institutions = [{
        name: "Escola de Informática",
        city: "Juiz de Fora",
        neighborhood: "Centro",
        presentation: "Este projeto é voltado para toda a comunidade, sendo ela carente, com o objetivo principal da inserção desses alunos no mundo digital.  Como a informática é uma ferramenta imprescindível ao trabalho, à comunicação e ao próprio modo de vida contemporânea o seu domínio resulta em uma inserção social mais ampla. Por isso, executamos ações que visam a ampliar o acesso das camadas populares ao mundo digital e que possibilitem esta clientela ingressar no mercado de trabalho. ",
        contact: { website: "http://einfojf.com.br", instagram: "http://instagram.com", facebook: "http://facebook.com", whatsapp: "http://wa.me/32912345678" }

    },
    {
        name: "InfoCenter",
        city: "Rio de Janeiro",
        neighborhood: "Cordovil",
        presentation: "Este projeto é voltado para toda a comunidade, sendo ela carente, com o objetivo principal da inserção desses alunos no mundo digital.  Como a informática é uma ferramenta imprescindível ao trabalho, à comunicação e ao próprio modo de vida contemporânea o seu domínio resulta em uma inserção social mais ampla. Por isso, executamos ações que visam a ampliar o acesso das camadas populares ao mundo digital e que possibilitem esta clientela ingressar no mercado de trabalho. ",
        contact: { website: "http://einfojf.com.br", instagram: "http://instagram.com", facebook: "http://facebook.com", whatsapp: "http://wa.me/32912345678" }

    },
    {
        name: "Projeto Social PC Terê",
        city: "Teresópolis",
        neighborhood: "Várzea",
        presentation: "Este projeto é voltado para toda a comunidade, sendo ela carente, com o objetivo principal da inserção desses alunos no mundo digital.  Como a informática é uma ferramenta imprescindível ao trabalho, à comunicação e ao próprio modo de vida contemporânea o seu domínio resulta em uma inserção social mais ampla. Por isso, executamos ações que visam a ampliar o acesso das camadas populares ao mundo digital e que possibilitem esta clientela ingressar no mercado de trabalho. ",
        contact: { website: "http://einfojf.com.br", instagram: "http://instagram.com", facebook: "http://facebook.com", whatsapp: "http://wa.me/32912345678" }

    },
    {
        name: "Escola de Informática 2",
        city: "Juiz de Fora",
        neighborhood: "Granbery",
        presentation: "Este projeto é voltado para toda a comunidade, sendo ela carente, com o objetivo principal da inserção desses alunos no mundo digital.  Como a informática é uma ferramenta imprescindível ao trabalho, à comunicação e ao próprio modo de vida contemporânea o seu domínio resulta em uma inserção social mais ampla. Por isso, executamos ações que visam a ampliar o acesso das camadas populares ao mundo digital e que possibilitem esta clientela ingressar no mercado de trabalho. ",
        contact: { website: "http://einfojf.com.br", instagram: "http://instagram.com", facebook: "http://facebook.com", whatsapp: "http://wa.me/32912345678" }

    },
    {
        name: "Escola de Informática 3",
        city: "Juiz de Fora",
        neighborhood: "São Pedro",
        presentation: "Este projeto é voltado para toda a comunidade, sendo ela carente, com o objetivo principal da inserção desses alunos no mundo digital.  Como a informática é uma ferramenta imprescindível ao trabalho, à comunicação e ao próprio modo de vida contemporânea o seu domínio resulta em uma inserção social mais ampla. Por isso, executamos ações que visam a ampliar o acesso das camadas populares ao mundo digital e que possibilitem esta clientela ingressar no mercado de trabalho. ",
        contact: { website: "http://einfojf.com.br", instagram: "http://instagram.com", facebook: "http://facebook.com", whatsapp: "http://wa.me/32912345678" }

    }
    ]


    const Card = (props) => {
        return <div className="box-1">
            <h2>{props.name}</h2>
            <p>{props.neighborhood}, {props.city}</p>
            <div className='divider'></div>
            <p>{props.presentation}</p>
            <div className='social-links-box row'>

                <div><p><a target="_blank" rel="noreferrer" href={props.website}>Site</a></p></div>
                <div><p><a target="_blank" rel="noreferrer" href={props.instagram}>Instagram</a></p></div>
                <div><p><a target="_blank" rel="noreferrer" href={props.facebook}>Facebook</a></p></div>
                <div><p><a target="_blank" rel="noreferrer" href={props.whatsapp}>Whatsapp</a></p></div>
            </div>
        </div>
    }


    return (
        <div className='container'>
            <div className='header'>
                <Image src="/computer-heart-icon.svg" height={100} width={100} />
                <div className='header-text'>
                    <h1>Lista de Instituições</h1>
                    <div className='header-sub-text row'>

                        <div className='header-menu-item'>
                            <p>
                                <Link href="/">
                                    <a>{"<"} Voltar ao formulário</a>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
            </div>

            <div className='form-container'>
                {institutions.map(
                    (item) =>

                        <Card
                            key={item.name}
                            name={item.name}
                            city={item.city}
                            neighborhood={item.neighborhood}
                            presentation={item.presentation}
                            website={item.contact.website}
                            instagram={item.contact.instagram}
                            facebook={item.contact.facebook}
                            whatsapp={item.contact.whatsapp}
                        />
                )}


            </div>
        </div>
    )
}


