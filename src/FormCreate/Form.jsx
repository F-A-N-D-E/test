import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { nanoid } from 'nanoid';

import FormCSS from '../styles/Form.module.css'
import QUEForm from "./QUEForm";
import { setDefultLocalStorage, setLocalDefultLocalStorage } from "../layouts/additionaleFunc";

export default function Form() {
    let params = useParams()

    const [list, setList] = useState()
    const [extraInfo, setExtraInfo] = useState(
        {
            nameTest: '',
            privat: false
        }
    )

    useEffect(() => {
        if (getDataFromDB()) {
            let dataForCreateExtraInfo = JSON.parse(localStorage.getItem('dataForCreateExtraInfo'))
            let dataForCreate = JSON.parse(localStorage.getItem('dataForCreate'))
            if (!dataForCreate) {
                setDefultLocalStorage('dataForCreate')
            } else setList(dataForCreate)
            if (!dataForCreateExtraInfo) {
                setDefultLocalStorage('dataForCreateExtraInfo')
            } else setExtraInfo(dataForCreateExtraInfo)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (<>
        <form method="post" onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}>

            {extraInfo.nameTest || extraInfo.nameTest === '' ?
                <input type="text" name="nameTest" className={FormCSS.inp_name} placeholder="Введите название теста" autoComplete="off" value={extraInfo.nameTest} onChange={(e) => {
                    let copy = { ...extraInfo }
                    copy.nameTest = e.target.value
                    setExtraInfo(copy)
                    if (!params.idTest) localStorage.setItem('dataForCreateExtraInfo', JSON.stringify(extraInfo))
                }} />
                :
                'qwe'
            }

            {list ? <>
                {list.map((elem, index) => {
                    return <QUEForm
                        key={index}
                        elemFromState={elem}
                        number={index}
                        remove={remove}
                        last={index === list.length - 1}
                        add={add}

                        mainList={list}
                        mainSetList={setList}
                        extraInfo={extraInfo}
                        setExtraInfo={setExtraInfo}
                    />
                })}
            </>
                :
                "ывлмыдлвтм"
            }

        </form>
    </>)
    /* 
        {
            nameTest: name: str,
            privat: 'on'||undefinde,
            [num + 'textQUE']: textQuestion: str,
            [num + 'type']: type: 'radio' || 'checkbox' || 'text',
            [num + ans: 'answerTrue' || 'answerFalse']: answer: str || str[],
            ...
        }
    */


    async function getDataFromDB() {
        if (params.idTest) {
            await fetch(`/api/create/${params.name}/${params.idTest}`)
                .then(r => r.json())
                .then(r => {
                    setList(r.data)
                    setExtraInfo({
                        nameTest: r.nameTest,
                        privat: r.privat
                    })
                })
                .catch(err => console.log(err))
            return false
        }
        return true
    }


    function add() {
        let copy = [...list]

        copy = [...copy,
        {
            id: nanoid(10),
            type: 'radio',
            text: '',
            answerTrue: [
                [nanoid(3), '']
            ],
            answerFalse: [
                [nanoid(3), '']
            ],
        }
        ]
        setList(copy)
        if (!params.idTest) localStorage.setItem('dataForCreate', JSON.stringify(copy))
    }

    function remove(id) {
        let copy = [...list]
        let index = copy.findIndex(elem => elem.id === id)

        copy.splice(index, 1)
        setList(copy)
        if (!params.idTest) localStorage.setItem('dataForCreate', JSON.stringify(copy))
    }
}