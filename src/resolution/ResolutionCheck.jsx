import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ResolCSS from '../styles/Resolution.module.css'

export default function ResolutionCheck() {
    let [data, setData] = useState()
    let param = useParams()

    async function getData() {
        let dataFromDB = await fetch(`/api/resolution/${param.id}/check`).then(r => r.json()).then(r => r)
        let copy = { ...dataFromDB }

        setData(copy)
    }

    useEffect(() => {
        getData()
    }, [])

    return <>
        {data ? <>

            <div><h3 className={ResolCSS.resH3}>{data.name}</h3></div>

            {render().map((elem, index, arr) => {
                if (index === 0) {
                    return <div key={index} className={ResolCSS.res + ' ' + ResolCSS.topBorder}>
                        {elem}
                    </div>
                } else if (index + 1 === arr.length) {
                    return <div key={index} className={ResolCSS.sum}>
                        {elem}
                    </div>
                } else {
                    return <div key={index} className={ResolCSS.res}>
                        {elem}
                    </div>
                }
            })}

        </>
            :
            <div>load</div>
        }
    </>



    function render() {
        let arr = []
        let countTrueAnswer = 0

        let userAnswer = data.data.data,
            tureAnswer = data.data.tureAnswer;

        for (let keyUserAnswer in userAnswer) {
            let res
            let valueFuncSpan = setSpan(userAnswer[keyUserAnswer], tureAnswer[keyUserAnswer])


            res = <><p className={ResolCSS.resP}>{arr.length + 1}. {keyUserAnswer}</p>
                <div className={ResolCSS.variant}>Ответ пользователя: {typeof userAnswer[keyUserAnswer] === 'object' ?
                    userAnswer[keyUserAnswer].join(', ') : userAnswer[keyUserAnswer]
                } {valueFuncSpan[0]} {setDivTrueAns(valueFuncSpan[1], tureAnswer[keyUserAnswer])}

                </div></>



            arr.push(res)
        }

        arr.push(countTrueAnswer + ' из ' + (data.length + 1))
        return arr


        function setSpan(user, check) {
            let arr = []
            let includeUserAns = check.includes(user)

            if (typeof check === 'object' && typeof user === 'string' && includeUserAns) {
                ++countTrueAnswer
                arr = [<span className={ResolCSS.comments + ' ' + ResolCSS.true}>{'// верно'}</span>, true]
                // eslint-disable-next-line eqeqeq
            } else if (check == user) {
                ++countTrueAnswer
                arr = [<span className={ResolCSS.comments + ' ' + ResolCSS.true}>{'// верно'}</span>, true]
            } else if (typeof check === 'object' && typeof user === 'object') {

                let num = 0
                for (let elem of check) {
                    if (user.includes(elem)) num += 1
                }
                if (num === check.length) {
                    ++countTrueAnswer
                    arr = [<span className={ResolCSS.comments + ' ' + ResolCSS.true}>{'// верно'}</span>, true]
                } else {
                    arr = [<span className={ResolCSS.comments + ' ' + ResolCSS.false}>{'// неверно'}</span>, false]
                }

            } else {
                arr = [<span className={ResolCSS.comments + ' ' + ResolCSS.false}>{'// неверно'}</span>, false]
            }

            return arr
        }


        function setDivTrueAns(spanBool, check) {
            if (spanBool === false) {

                return typeof check === 'string' ?
                    <div className={ResolCSS.comments}>Верный ответ: {check}</div>
                    :
                    <div className={ResolCSS.comments}>Верный ответ: {check.join(', ')}</div>
            }
        }
    }
}