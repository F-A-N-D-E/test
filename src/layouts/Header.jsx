import React, { useRef, useState, useEffect } from 'react';
import AppCSS from '../styles/App.module.css'
import { Link } from 'react-router-dom';

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
                    <Link to={'/'} className={AppCSS.menu_item}>Главная</Link>
                    <Link to={name ? `/create/${name}` : '/login'} className={AppCSS.menu_item}>Создать</Link>
                    <Link to={name ? `/personal/${name}` : '/login'} className={AppCSS.menu_item}>Кабинет</Link>
                    <Link to={'/login'} className={AppCSS.menu_item}>Войти</Link>
                </nav>
            </div>
        </header>
    </>)
}