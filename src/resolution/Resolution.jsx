import React from "react";
import ResolCSS from '../styles/Resolution.module.css'

export default function Resolution({ data, num }) {

    return <>
        <p className={ResolCSS.resP}>{num + 1}. {data.textQUE}</p>

        <div className={ResolCSS.variant}>

            {data.answer.map((elem, index) => {
                if (data.type === 'radio') {
                    return <label className={ResolCSS.label} key={index}><input type="radio" name={data.textQUE} value={elem} />{elem}</label>
                } else if (data.type === 'checkbox') {
                    return <label className={ResolCSS.label} key={index}><input type="checkbox" name={data.textQUE} value={elem} />{elem}</label>
                }
                return undefined
            })}
            {data.type === 'text' && <input className={ResolCSS.input} type="text" name={data.textQUE} autoComplete="off" />}

        </div>

    </>
}