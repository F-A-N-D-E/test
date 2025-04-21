import React, { useEffect, useState } from "react";
import ResolCSS from '../styles/Resolution.module.css'

import Resolution from "./Resolution";
import { setRandomSort } from "../layouts/additionaleFunc";

export default function ResolutionForm() {
    let [data, setData] = useState([])

    const getTestFromDB = async () => {
        let paramId = window.location.pathname.split('/')[2]
        let dataProcess = {}
        let dataFromServer = await fetch(`/resolution/${paramId}`).then(res => res.json()).then(r => r.data)

        for (let key in dataFromServer) {
            let split = key.split('_')

            if ((+split[0] || +split[0] === 0) && !split[1].startsWith('answer')) {
                dataProcess[+split[0]] = {
                    ...dataProcess[+split[0]],
                    [split[1]]: dataFromServer[key]
                }

            } else if (split[0] === 'nameTest') {
                dataProcess.info = dataFromServer[key]

            } else if (split[1]) {
                let valFalse = dataFromServer[split[0] + '_answerFalse']
                let valTrue = dataFromServer[split[0] + '_answerTrue']

                if (typeof valTrue === 'object' && typeof valFalse === 'object') {
                    dataProcess[+split[0]].answer = setRandomSort([...valFalse, ...valTrue])
                } else if (typeof valTrue === 'object' && typeof valFalse === 'string') {
                    dataProcess[+split[0]].answer = setRandomSort([...valTrue, valFalse])
                } else if (typeof valTrue === 'string' && typeof valFalse === 'object') {
                    dataProcess[+split[0]].answer = setRandomSort([...valFalse, valTrue])
                } else if (typeof valTrue === 'string' && typeof valFalse === 'string') {
                    dataProcess[+split[0]].answer = setRandomSort([valTrue, valFalse])
                } else if (!valTrue) {
                    dataProcess[+split[0]].answer = [valFalse]
                } else if (!valFalse) {
                    dataProcess[+split[0]].answer = [valTrue]
                }
            }
        }

        dataProcess = Object.values(dataProcess)
        setData(dataProcess)
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