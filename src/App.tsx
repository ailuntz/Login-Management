import Comp1 from "@/components/Comp1"
import Comp2 from "@/components/Comp2"
import { Button } from "antd"
import { UpCircleOutlined } from "@ant-design/icons"
import {useRoutes, Link} from "react-router-dom"
import router from './router'

function App() {

const outlet=useRoutes(router)

  return (
    <>
      <div className='App'>
{/* <Link to ="/home">Home</Link> |
<Link to ="/about">About</Link> |
<Link to ="/user">User</Link> */}
{outlet}
      </div>
    </>
  )
}

export default App
