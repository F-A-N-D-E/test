import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Root from './Root';
import BaseError from './error/BaseError'
import Form from './FormCreate/Form';
import HomeDisplay from './Card/HomeDisplay';
import ResolutionForm from './resolution/ResolutionForm';
import ResolutionCheck from './resolution/ResolutionCheck';
import './styles/App.module.css'
import Authorization from './layouts/Authorization';
import MainPagePers from './personal/MainPagePers'

let router = createBrowserRouter([
  {
    path: '/',
    element: <Root component={<HomeDisplay/>}/>,
    errorElement: <BaseError/>,
  },
  {
    path: '/create/:name/:idTest?',
    element: <Root component={<Form/>}/>,
    errorElement: <BaseError/>
  },
  {
    path: '/resolution/:id',
    element: <Root component={<ResolutionForm/>} />,
    errorElement: <BaseError />,
  },
  {
    path: '/resolution/:id/check',
    element: <Root component={<ResolutionCheck/>} />,
    errorElement: <BaseError />,
  },
  {
    path: '/authorization',
    element: <Authorization method={'post'}/>,
    errorElement: <BaseError />,
  },
  {
    path: '/login',
    element: <Authorization method={'get'}/>,
    errorElement: <BaseError />,
  },
  {
    path: '/personal/:name',
    element: <Root component={<MainPagePers/>}/>,
    errorElement: <BaseError />,
  },
  {
    path: '/remove/:id',
    element: <Root component={<MainPagePers/>}/>,
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);

