import React from 'react';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import MainCSS from './styles/Main.module.css'

function Root(props) {
  return (<>
    <Header />
    <main>
      <div className={MainCSS.wrapper}>
        {props.component}
      </div>
    </main>
    <Footer />
  </>);
}

export default Root;