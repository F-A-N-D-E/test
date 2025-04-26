import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'

import PageCardTest from "./PageCardTest";
import PersCSS from '../styles/Personal.module.css'

export default function MainPagePers() {
    let [data, setData] = useState([]) // [{nameTest: 'Test', id: 'yl4hZ7', length: 1}]
    let [switchParam, setSwitchParam] = useState('pub')

    let params = useParams()


    async function getDataFromDB() {
        await fetch(`/api/personal/${params.name}`)
            .then(r => r.json())
            .then(r => {
                setData(r.data)
                setSwitchParam(JSON.parse(localStorage.getItem('pubPriv')))
            })
            .catch(err => console.log(err))
    }


    useEffect(() => {
        getDataFromDB()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <>
        <div className={PersCSS.head}>
            <button className={`${PersCSS.switchBtn} ${switchParam === 'pub' ? PersCSS.active : undefined}`} onClick={() => setSwitchAndStorage('pub')}>Публичные</button>
            <button className={`${PersCSS.switchBtn} ${switchParam === 'priv' ? PersCSS.active : undefined}`} onClick={() => setSwitchAndStorage('priv')}>Приватные</button>
        </div>

        <div>
            {data &&
                data.map((elem, index) => {
                    if (switchParam === 'pub' && !elem.privat) {
                        return <PageCardTest
                            key={index}
                            name={elem.nameTest}
                            length={elem.length}
                            idTest={elem.id}

                            switchParam={switchParam}
                            setSwitchParam={setSwitchParam}
                        />
                    } else if (switchParam === 'priv' && elem.privat) {
                        return <PageCardTest
                            key={index}
                            name={elem.nameTest}
                            length={elem.length}
                            idTest={elem.id}

                            switchParam={switchParam}
                            setSwitchParam={setSwitchParam}
                        />
                    }
                    return ''
                })
            }
        </div>
    </>


    function setSwitchAndStorage(str = '') {
        setSwitchParam(str)
        localStorage.setItem('pubPriv', JSON.stringify(str))
    }
}