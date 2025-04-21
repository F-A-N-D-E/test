import React from "react";
import AppCSS from '../styles/App.module.css'

export default function Footer() {
    return (<>
        <footer className={AppCSS.footer}>
            <div className={AppCSS.footer_text}>Все права очень даже защищенны. Созданно <a href="https://vk.com/eshe_na_dne" target="_blanc">мною. </a>
                <a href="https://github.com/F-A-N-D-E/test" target="_blank">GitHab</a>
            </div>
        </footer>
    </>)
}