import React from "react";
import { useParams } from 'react-router-dom'

import PersCSS from '../styles/Personal.module.css'

export default function PageCardTest({ name, length, idTest }) {
    let params = useParams()

    async function deleteElem() {
        fetch(`/api/personal/remove/${idTest}`, {
            method: 'DELETE'
        }).then(r => {
            if (!r.ok) {
                throw new Error('Error delete')
            } else {
                window.location.reload()
            }
        })
    }

    async function copyHref() {
        await navigator.clipboard.writeText(`agl.pw/resolution/${idTest}`)
    }


    return <div className={PersCSS.card}>
        <div className={PersCSS.name}>{name}</div>

        <div className={PersCSS.option}>
            <div className={PersCSS.length}>В {length + 1}</div>

            <div>
                <button onClick={copyHref} className={PersCSS.switchBtn}>Поделиться</button>
                <a href={`/create/${params.name}/${idTest}`} className={PersCSS.switchBtn}>Изменить</a>
                <button onClick={deleteElem} className={PersCSS.switchBtn}>Удалить</button>
            </div>
        </div>
    </div>
}