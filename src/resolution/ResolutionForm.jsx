import React, { useEffect, useState } from "react";
import ResolCSS from '../styles/Resolution.module.css'

import Resolution from "./Resolution";
// import { setRandomSort } from "../layouts/additionaleFunc";

export default function ResolutionForm() {
    let [data, setData] = useState([])

    const getTestFromDB = async () => {
        let paramId = window.location.pathname.split('/')[2]
        let dataFromServer = await fetch(`/api/resolution/${paramId}`).then(res => res.json()).then(r => r.data)

        setData(dataFromServer)
    }

    useEffect(() => {
        getTestFromDB()
    }, [])
    return <>
        {data ? <>
            <form method="POST" >

                {data.map((elem, index) => {
                    if (typeof elem !== 'object') {
                        return <h3 className={ResolCSS.resH3} key={index}>{elem}</h3>
                    }
                })}

                {data.map((elem, index) => {
                    if (typeof elem === 'object') {

                        if (index === 0) {
                            return <div key={index} className={ResolCSS.res + ' ' + ResolCSS.topBorder}><Resolution data={elem} num={index} /></div>
                        } else {
                            return <div key={index} className={ResolCSS.res}><Resolution data={elem} num={index} /></div>
                        }
                    }
                })}



                <button className={ResolCSS.btnAdd} type="submit" >Завершить</button>
            </form>

        </>
            : <div>Загрузка</div>}
    </>
}