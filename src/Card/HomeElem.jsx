import React from "react";
import MainCSS from '../styles/Main.module.css'

export default function HomeElem({ nameTest, url, userName, length }) {

    return (<div className={MainCSS.card} onClick={() => {
        window.location.href = `resolution/${url}`
    }}>
        <p className={MainCSS.testName}>{nameTest}</p>

        <div className={MainCSS.option}>
            <p>{userName ? userName : 'author'}</p>
            <p className={MainCSS.length}>В: {length}</p>
        </div>


    </div>)
}