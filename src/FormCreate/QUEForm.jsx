import React from "react";
import { nanoid } from "nanoid";
import { useParams } from "react-router-dom";
import { resetLocalStorage } from "../layouts/additionaleFunc";

import FormCSS from '../styles/Form.module.css'

export default function QUEForm({
    elemFromState,
    number,
    remove,
    last,
    add,
    mainList,
    mainSetList,
    extraInfo,
    setExtraInfo
}) {

    let { idTest } = useParams()
    let num = number + '_'



    // /сокращенка для последней кнопки 'завершить', "добавить вопрос", 'удалить вопрос', "добавить"








    function switchTypeAnswer(type) {
        let copy = [...mainList]
        let indexMainStait = copy.findIndex(elem => elem.id === elemFromState.id)

        if (copy[indexMainStait].type !== type) {
            copy[indexMainStait].type = type
            copy[indexMainStait].answerTrue = [
                [nanoid(3), '']
            ]
            copy[indexMainStait].answerFalse = [
                [nanoid(3), '']
            ]

            mainSetList(copy)
            if (!idTest) localStorage.setItem('dataForCreate', JSON.stringify(copy))
        }
    }

    function ChangeTextQue(e) {
        let copy = [...mainList]
        let indexMainStait = copy.findIndex(elem => elem.id === elemFromState.id)

        copy[indexMainStait].text = e.target.value
        mainSetList(copy)
        if (!idTest) localStorage.setItem('dataForCreate', JSON.stringify(copy))
    }

    return (<div className={FormCSS.blockQUE}>
        <textarea className={FormCSS.textarea} name={num + "textQUE"} value={elemFromState.text} placeholder="Введите текст вопроса" onChange={e => ChangeTextQue(e)} ></textarea>

        <div className={FormCSS.type}>
            <p className={FormCSS.type_para}>Выберите тип ответа:</p>

            <label><input type="radio" name={num + "type"} value='radio' onChange={() => switchTypeAnswer('radio')} checked={elemFromState.type === 'radio'} />Один вариант</label>

            <label><input type="radio" name={num + "type"} value='text' onChange={() => switchTypeAnswer('text')} checked={elemFromState.type === 'text'} />Текст</label>

            <label><input type="radio" name={num + "type"} value='checkbox' onChange={() => switchTypeAnswer('checkbox')} checked={elemFromState.type === 'checkbox'} />Выбрать несколько</label>
        </div>
        {setAnswers()}
    </div>)




    function setAnswers() { // отоброжение по типу ответа
        if (elemFromState.type === 'radio') { // radio btn
            return (<>
                <div className={FormCSS.answer_block}>
                    <p>Верный ответ: </p>
                    {mapList('answerTrue')}

                    <p>Неверный: </p>
                    {mapList('answerFalse')}
                </div>

                {lastBtn('answerFalse')}
            </>)


        } else if (elemFromState.type === 'text') { // text btn
            return (<>
                <div className={FormCSS.answer_block}>
                    <p className={FormCSS.pInTextType}>Вариант возможного написания правильного ответа: </p>
                    {mapList('answerTrue')}
                </div>

                {lastBtn('answerTrue')}
            </>)


        } else if (elemFromState.type === 'checkbox') { // checkbox
            return (<>
                <div className={FormCSS.answer_block}>
                    <p>Верный ответ: </p>
                    {mapList('answerTrue')}

                    <button type="button" className={FormCSS.btnAdd + ' ' + FormCSS.margin_bottom} onClick={() => btnAddAns('answerTrue')}>Добавить</button>

                    <p>Неверный ответ: </p>
                    {mapList('answerFalse')}
                </div>

                {lastBtn('answerFalse')}
            </>)
        }
    }


    function lastBtn(bool) { // сокращенка для последней кнопки 'завершить', "добавить вопрос", 'удалить вопрос', "добавить"
        if (last) {
            return <div className={FormCSS.lastBlock}>

                <button type="button" className={FormCSS.btnAdd + ' ' + FormCSS.lastBtn} onClick={() => btnAddAns(bool)}>Добавить</button>

                <div>
                    <label><input type="checkbox" name="privat" checked={extraInfo.privat} onChange={(e) => {
                        let copy = { ...extraInfo }
                        copy.privat = e.target.checked
                        setExtraInfo(copy)
                        if (!idTest) localStorage.setItem('dataForCreateExtraInfo', JSON.stringify(copy))
                    }} /> Приватный тест </label>

                    <button type="button" className={FormCSS.btnAdd + ' ' + FormCSS.lastBtn} onClick={() => add()}>Добавить вопрос</button>

                    <button type={number === 0 ? 'reset' : 'button'} className={FormCSS.removeAnsBtn} onClick={(number !== 0 || mainList.length > 1) ? () => remove(elemFromState.id) : undefined}>удалить вопрос</button>

                    <button type="submit" className={FormCSS.btnAdd + ' ' + FormCSS.lastBtn} onClick={resetLocalStorage}>Завершить</button>
                </div>
            </div>
        } else {
            return <div className={FormCSS.lastBlock}>

                <button type="button" className={FormCSS.btnAdd} onClick={() => btnAddAns(bool)}>Добавить</button>

                <button type={number === 0 ? 'reset' : 'button'} className={FormCSS.removeAnsBtn} onClick={(number !== 0 || mainList.length > 1) ? () => remove(elemFromState.id) : undefined}>удалить вопрос</button>

            </div>
        }
    }

    function mapList(bool) { // сокращенка для вывода списка ответа

        let res = elemFromState[bool].map((elem, index) => {
            return <div key={index}>
                {index === 0 ?
                    <input type='text' name={num + bool} value={elem[1]} onChange={(e) => setTextAnsw(e, bool, elem[0])} className={FormCSS.answer} autoComplete="off" />

                    :

                    <>
                        <input type='text' name={num + bool} value={elem[1]} onChange={(e) => setTextAnsw(e, bool, elem[0])} className={FormCSS.answer} autoComplete="off" />

                        <button type="button" className={FormCSS.removeAnsBtn} onClick={() => btnRemoveAns(elem[0], bool)}>удалить</button>
                        <br />
                    </>
                }
            </div>
        })
        return res
    }




    function btnAddAns(bool) { // кнопка добавления ответа
        let copy = [...mainList]

        let indexMainStait = copy.findIndex(elem => elem.id === elemFromState.id)

        if (bool === 'answerTrue') {
            elemFromState.answerTrue = [...elemFromState.answerTrue,
            [nanoid(3), '']
            ]
        } else {
            elemFromState.answerFalse = [...elemFromState.answerFalse,
            [nanoid(3), '']
            ]
        }

        copy[indexMainStait] = elemFromState
        mainSetList(copy)
        if (!idTest) localStorage.setItem('dataForCreate', JSON.stringify(copy))
    }

    function setTextAnsw(e, bool, id) { // реактивная замена ответа в стейте
        let copy = [...mainList]
        let indexMainStait = copy.findIndex(elem => elem.id === elemFromState.id)
        let indexAnswerInMainState = copy[indexMainStait][bool].findIndex(elem => elem[0] === id)

        copy[indexMainStait][bool][indexAnswerInMainState][1] = e.target.value

        mainSetList(copy)
        if (!idTest) localStorage.setItem('dataForCreate', JSON.stringify(copy))
    }

    function btnRemoveAns(id, bool) { // кнопка удаления ответа из стейта
        let copy = [...mainList]
        let indexMainStait = copy.findIndex(elem => elem.id === elemFromState.id)
        let indexAnswerInMainState = copy[indexMainStait][bool].findIndex(elem => elem[0] === id)

        copy[indexMainStait][bool].splice(indexAnswerInMainState, 1)

        mainSetList(copy)
        if (!idTest) localStorage.setItem('dataForCreate', JSON.stringify(copy))
    }
}