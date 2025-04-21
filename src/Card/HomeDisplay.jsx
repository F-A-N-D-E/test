import React, { useEffect, useState } from "react";
import MainCSS from '../styles/Main.module.css'
import HomeElem from "./HomeElem";

export default function HomeDisplay() {
    const [info, setInfo] = useState([])

    async function getDate() {
        let response = await fetch('/')
            .then(res => res.json()).then(r => r.data)

        setInfo(response)
    }

    useEffect(() => {
        getDate()
    }, [])

    return <div className={MainCSS.display_grid}>
        {info.map((elem, index) => {
            return <HomeElem
                key={index}
                nameTest={elem.nameTest}
                elem={elem}
                url={elem.id}
                userName={elem.userName}
                length={+elem.length + 1}
            />
        })}
    </div>
}