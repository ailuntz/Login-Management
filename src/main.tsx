import React from 'react'
import ReactDOM from 'react-dom/client'
// reset first, then ui framework , then component framework
import "reset-css"
import "@/assets/styles/global.scss"
import Router from "./router"
import App from './App'

import{BrowserRouter} from "react-router-dom"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>

    <BrowserRouter>
    <React.Suspense fallback={<div>Loading...</div>}>
    <App/>
        </React.Suspense>

    </BrowserRouter>
   
  </React.StrictMode>,
)
