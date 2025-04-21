import React, { useRef, useState, useEffect } from 'react';
import AppCSS from '../styles/App.module.css'

export default function Header() {
    let [name, setName] = useState()

    let refMenu = useRef(null)
    let refIcon = useRef(null)

    function animIcon() {
        let block = refMenu.current
        let icon = refIcon.current
        block.classList.toggle(AppCSS.open)
        icon.classList.toggle(AppCSS.open)
    }

    useEffect(() => {
        setName(document.cookie.split('=')[1])
    }, [])

    return (<>
        <header className={AppCSS.header} >
            <div className={AppCSS.logo}>AGL</div>

            <h1>Тест</h1>

            <div ref={refIcon} className={AppCSS.menu_icon_block} onClick={() => animIcon()}>
                <div className={AppCSS.menu_icon}></div>
            </div>

            <div ref={refMenu} className={AppCSS.menu} >
                <nav className={AppCSS.menu_block}>
                    <div className={AppCSS.logo}>AGL</div>
                    <a href={'/'} className={AppCSS.menu_item}>Главная</a>
                    <a href={name ? `/create/${name}` : '/login'} className={AppCSS.menu_item}>Создать</a>
                    <a href={name ? `/personal/${name}` : '/login'} className={AppCSS.menu_item}>Кабинет</a>
                    <a href={'/login'} className={AppCSS.menu_item}>Войти</a>
                </nav>
            </div>
        </header>
    </>)
}