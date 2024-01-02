import { lazy } from "react"
import Home from "../views/Home"
import { Navigate } from "react-router-dom"

const About = lazy(() => import("../views/About"))
const User = lazy(() => import("../views/User"))
const routes = [
    {
        path: "/",
        element: <Navigate to="/home" />
    },


    {
        path: "/home",
        element: <Home />
    },

    {
        path: "/about",
        element: <About />
    },
    {
        path: "/user",
        element: <User />
    },

]
export default routes