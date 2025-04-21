import React, { useEffect, useRef } from "react";

import AuthorizCSS from '../styles/Authorization.module.css'
import AppCSS from '../styles/App.module.css'
import { resetLocalStorage } from "./additionaleFunc";

export default function Authorization({ method }) {
    let refName = useRef(null)
    let refPass = useRef(null)
    let refRepeatPass = useRef(null)

    async function requestToServer() {
        let url = window.location.pathname

        if (url === '/authorization') {

            await fetch('/authorization')
                .then(r => r.text())
                .then(r => {
                    if (r === 'false') alert('Такое имя уже занято')
                })
                .catch(err => console.log(err))

        } else if (url === '/login') {

            await fetch('/login')
                .then(r => r.json())
                .then(r => {
                    if (r.reg === false) {
                        alert('Неверный логин или пароль')
                    } else if (r.reg === true) {
                        window.location.href = '/'
                    }
                })
                .catch(err => console.log(err))
        }
    }

    useEffect(() => {
        requestToServer()
    }, [])



    return <div className={AuthorizCSS.back}>
        <form method={method} onKeyDown={(e) => {
            if (e.key === 'Enter' && stopSend()) {
                e.preventDefault()
            }
        }} >

            <div className={AuthorizCSS.blockReg}>

                <div className={AppCSS.logo + ' ' + AuthorizCSS.autho}>AGL</div>

                <div className={AuthorizCSS.blockInput}>
                    <p className={AuthorizCSS.authoP}>Введите логин:</p>
                    <input type="text" name="name" ref={refName} autoComplete="off" />
                </div>

                <div className={AuthorizCSS.blockInput}>
                    <p className={AuthorizCSS.authoP}>Введите пароль:</p>
                    <input type="password" name="password" ref={refPass} autoComplete="off" />
                </div>

                {method === 'post' ?
                    <>
                        <div className={AuthorizCSS.blockInput}>
                            <p className={AuthorizCSS.authoP}>Повторите пароль:</p>
                            <input type="password" name="repeatPassword" ref={refRepeatPass} autoComplete="off" />
                        </div>

                        <button type="submit" className={AuthorizCSS.btnAutho} onClick={(e) => {
                            if (stopSend()) e.preventDefault()
                        }}>Зарегистрироваться</button>
                        <a href="/login" className={AuthorizCSS.switchBtn}>Войти</a>
                    </>
                    :
                    <>
                        <button type="submit" className={AuthorizCSS.btnAutho} onClick={(e) => {
                            if (stopSend()) e.preventDefault()
                            resetLocalStorage()
                        }}>Войти</button>
                        <a href="/authorization" className={AuthorizCSS.switchBtn}>Зарегистрироваться</a>
                    </>
                }

                <a href="/" className={AuthorizCSS.switchBtn}>Главная</a>

            </div>

        </form>
    </div>




    function stopSend() {
        let name = refName.current,
            pass = refPass.current,
            repeatPass = refRepeatPass.current

        if (method === 'post') {
            if (!name.value || !pass.value || !repeatPass.value) {
                alert('Все поля должны быть заполнены')
                return true
            } else if (pass.value !== repeatPass.value) {
                alert('Пароли не совпадают')
                repeatPass.value = ''
                return true
            } else if (pass.value.length < 4 || /[а-яё]/i.test(pass.value)) {
                alert('Пароль должен быть не меньше четырех символов и состоять из латиницы или цифр')
                repeatPass.value = ''
                pass.value = ''
                return true
            } else {
                return false
            }

        } else {
            if (!name.value || !pass.value) {
                alert('Все поля должны быть заполнены')
                return true
            } else if (pass.value.length < 4 || /[а-яё]/i.test(pass.value)) {
                alert('Пароль должен быть не меньше четырех символов и состоять из латиницы или цифр')
                pass.value = ''
                return true
            } else {
                return false
            }
        }


    }
}