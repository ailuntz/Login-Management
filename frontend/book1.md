React通用后台管理系统-笔记1
环境

node: 16.17.1

npm: 8.15.0

Ant Design of React官网：https://ant.design/docs/react/introduce-cn

一、创建项目 

npm init vite

Project name: lege-management

Select a framework: react

Select a variant: react-ts

打开package.json，参考以下各模块版本：

    "react-dom": "^18.2.0",

    "react-redux": "^7.2.8",

    "react-router-dom": "^6.3.0",

二、项目目录初始化

删除掉官方自带而对我们暂时帮助不大的文件。

删除src下除了main.tsxs和App.tsx的其他文件；

主文件/src/main.tsx修改成：

import React from 'react'

import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

 App.tsx文件修改成：

import React from 'react'

    <div className="App">

三、样式初始化

【注：乐哥认为reset-css比Normalize.css更直接，干净利落去除默认样式，更适合在企业里的场景， 所以用reset-css，而不用Normalize.css】 路径下执行以下命令，

安装reset-css：

npm i reset-css
在src/main.tsx中引入reset-css：

import React from 'react'

import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

四、scss的安装和初步使用

安装sass :

# 安装sass vite中很方便，loader这些都不用自己配置，只需要安装好即可使用

npm i --save-dev sass
src下新建assets/styles/global.scss：

background-color: $color;

main.tsx中引入全局样式

import React from 'react'

import ReactDOM from 'react-dom/client'

import "./assets/styles/global.scss"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

 五、配置项目路径别名

5.1、路径别名的配置

目前ts对@指向src目录的提示是不支持的，vite默认也是不支持的。

所以需要手动配置@符号的指向

在vite.config.ts中添加配置：

import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

import path from "path"   // 添加了 path

// https://vitejs.dev/config/

export default defineConfig({

      "@":path.resolve(__dirname,'./src')

这时候引入的会path模块报红，但其实我们已经有node，所以就已经有path模块，只是缺少ts的一些 声明配置。

所以需要安装关于node这个库的ts声明配置

npm i -D @types/node
安装成功就没有报红了,如果import后面的path报红，就把引入换成 import * as path from 'path';

5.2、配置路径别名的提示

虽然现在路径别名已经有了，但是在文件中输入@是没有提示路径的

需要我们在tsconfig.json中：添加两项配置

配置好之后敲@后就有路径资源提示了

六、scss模块化

6.1、scss的进一步使用

src下新建components文件夹

components文件夹下新建Comp1文件夹，新建index.tsx和comp1.scss src/components/Comp1/index.tsx中：

src/components/Comp1/comp1.scss中：

components文件夹下新建Comp2文件夹，新建index.tsx:

// ！！！注意，在Comp2组件中不引入上面的comp1.scss样式

在App.tsx中使用这两个组件：

import { useState } from 'react'

import Comp1 from "./components/Comp1"

import Comp2 from "./components/Comp2"

const [count, setCount] = useState(0)

此时会发现，Comp2/index.tsx中没有引入comp1.scss竟然也有box的样式！！！

说明Comp1的引入comp1.scss就是全局引入，这不是我们要的现象，所以这时候我们就需要用到模块 化css

6.2、scss的模块化

src/components/Comp1/comp1.scss 改名为 comp1.module.scss

在comp1.tss中：

import styles from "./comp1.module.scss";

<div className={styles.box}>

这样就不会影响其他组件了。

！！注意：styles.box 的 box 在 .module.scss 文件中只能是类名，标签名字不起作用

七、Antd Design初步引入

安装Antd Design

// 使用 npm 安装

npm install antd --save

// 使用 yarn 安装

yarn add antd

安装图标所需要的模块

// 使用 npm 安装

npm install --save @ant-design/icons

// 使用 yarn 安装

yarn add @ant-design/icons 

App组件中引入即可使用：

import { useState } from 'react'

import { Button } from 'antd';

import {FastBackwardOutlined} from "@ant-design/icons"

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

const [count, setCount] = useState(0)

<Button type="primary">按钮文字</Button>

<FastBackwardOutlined style={{ fontSize: '40px', color: '#08c' }}/>

ps: 如果你的vscode不兼容jsx语法提示：请打开vscode配置文件，补充：

"emmet.triggerExpansionOnTab": true,

"emmet.includeLanguages": {

"javascript": "javascriptreact"

 八、配置Antd Design样式自动按需引入

antd的4.x版本以上已经支持组件按需引入，我们只需要解决样式上的自动按需引入即可

安装插件vite-plugin-style-import

npm install vite-plugin-style-import@1.4.1 -D
在vite.config.ts中进行配置：

import styleImport,{AntdResolve} from 'vite-plugin-style-import';

export default defineConfig({

在去掉APP.vue中的 import 'antd/dist/antd.css'; // or 'antd/dist/antd.less' 这一行样式引 入

启动项目，发现报错，缺少less，进行安装

npm i less@2.7.1 -D
九、React路由——第一种配置方案（旧项目中的写法） 

9.1、初步展示

我们在这里模拟vue中的home和about两个组件展示

【1、准备界面】首先src下创建views文件夹，views文件夹下创建Home.tsx和About.tsx，大致代码如 下：

【2、配置对应关系】/src下新建router文件夹，再进去新建index.tsx

import Home from "../views/Home"

import About from "../views/About"

import {BrowserRouter,Routes,Route} from "react-router-dom"

// 两种路由模式的组件： BrowserRouter ( History模式 ) ， HashRouter( Hash模式 )

// const baseRouter = () => {

// 以上写法可以简写为：

const baseRouter = () => (

<Route path="/" element={<App/>}>

<Route path="/home" element={<Home/>}></Route>

<Route path="/about" element={<About/>}></Route>

export default baseRouter

【3、替换顶级组件】在/src/main.tsx中把顶级组件App替换为这个路由对象：

import Router from './router';

ReactDOM.createRoot(document.getElementById('root')!).render(

【4、添加窗口组件】/src/App.tsx中，使用 组件作为占位符组件：

import {Outlet} from "react-router-dom";

//const [count, setCount] = useState(0)

{/* 占位符组件，窗口，有点类似于Vue中的 router-view */}

这样就可以在浏览器中访问，下面的地址看到页面了：

http://localhost:3002/home

http://localhost:3002/about

9.2、编程式导航--设置菜单点击跳转 

/src/App.tsx中，使用 组件进行跳转：

import {Outlet,Link} from "react-router-dom"

<Link to="/home">home</Link> |

<Link to="/about">about</Link>

{/* 占位符组件，窗口，有点类似于Vue中的 router-view */}

9.3、配置重定向

/src/router/index.tsx中：

import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom"

<Route path="/" element={<App/>}>

{/* 配置 用户访问/的时候，重定向到/home路径 */}

<Route path="/" element={<Navigate to="/home" />}></Route>

十、React路由——第二种配置方案

10.1、路由表的写法

和上面一样，在这里模拟vue中的home和about两个组件展示

【1、准备界面】在上面已经完成 【

2、配置对应关系】/src/router/index.tsx中：

import Home from "../views/Home"

import About from "../views/About"

import {Navigate} from "react-router-dom"

element:<Navigate to="/home" />,

// { path: "*", element: <Navigate to="/" /> },

【3、路由组件的添加】在/src/main.tsx中在顶级组件App外层添加路由组件：

import { BrowserRouter } from "react-router-dom"

ReactDOM.createRoot(document.getElementById('root')!).render(

【4、添加窗口组件】/src/App.tsx中，使用hooks来创建占位符：

import {useRoutes,Link} from "react-router-dom"

import router from './router';

const outlet = useRoutes(router);

<Link to="/home">home2</Link> |

<Link to="/about">about2</Link>

{/* 占位符组件，窗口，有点类似于Vue中的 router-view */}

10.2、路由懒加载

/src/router/index.tsx中把About做成懒加载组件：

import { lazy } from 'react'

import Home from "../views/Home"

const About = lazy(() => import("../views/About"))

10.3、懒加载组件需要嵌套Loading组件的报错解决 报错解决：此时lazy懒加载的话还是会报错



 Uncaught Error: A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator.

React路由懒加载的在嵌套路由中的时候强制要求，展示时候必须要有loading组件 

/src/router/index.tsx中：

<React.Suspense fallback={<div>Loading...</div>}>

简化后的写法

import React from 'react';

import { lazy } from 'react'

import Home from "../views/Home"

const About = lazy(() => import("../views/About"))

import {Navigate} from "react-router-dom"

const withLoadingComponent = (comp:JSX.Element)=>{

return <React.Suspense fallback={<div>Loading...</div>}>

element:<Navigate to="/home" />,

element:withLoadingComponent(<About/>),

// { path: "*", element: <Navigate to="/" /> },

十一、布局解决方案——Layout组件（含侧边栏）

布局组件文档：https://ant.design/components/layout-cn/

注意：不要直接点复制代码，先展开代码部分，里面也包含了样式代码。如果直接点复制代码，样式代 码直接被忽略！

11.1、初步使用

App组件中：

import {useRoutes} from "react-router-dom"

import router from "./router"

const outlet = useRoutes(router)

Home.tsx组件中：

} from '@ant-design/icons';

import type { MenuProps } from 'antd';

import { Breadcrumb, Layout, Menu } from 'antd';

import React, { useState } from 'react';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [

getItem('Option 1', '1', <PieChartOutlined />),

getItem('Option 2', '2', <DesktopOutlined />),

getItem('User', 'sub1', <UserOutlined />, [

getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'),

getItem('Team 2', '8')]),

getItem('Files', '9', <FileOutlined />),

const View: React.FC = () => {

const [collapsed, setCollapsed] = useState(false);

<Layout style={{ minHeight: '100vh' }}>

<Sider collapsible collapsed={collapsed} onCollapse={value =>

<div className="logo" ></div>

<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items=

<Layout className="site-layout">

<Header className="site-layout-background" style={{ padding: 0 }} />

<Content style={{ margin: '0 16px' }}>

<Breadcrumb style={{ margin: '16px 0' }}>

<Breadcrumb.Item>User</Breadcrumb.Item>

<Breadcrumb.Item>Bill</Breadcrumb.Item>

<div className="site-layout-background" style={{ padding: 24,

<Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by

global.scss添加全局样式

background: rgba(255, 255, 255, 0.3);

.site-layout .site-layout-background {

11.2、右侧样式调整

Home.tsx中：

<Layout style={{ minHeight: '100vh' }}>

<Sider collapsible collapsed={collapsed} onCollapse={value =>

<div className="logo" ></div>

<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items=

<Layout className="site-layout">

<Header className="site-layout-background" style={{ paddingLeft:

<Breadcrumb className='crumb'>

<Breadcrumb.Item>User</Breadcrumb.Item>

<Breadcrumb.Item>Bill</Breadcrumb.Item>

<Content style={{ margin: '16px' }}>

<div className="site-layout-background" style={{ padding: 24,

<Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by

global.scss样式补充

设置右侧大盒子自动占满

<Content style={{ margin: '16px 16px 0' }} className="site-layout-background">

<div style={{ padding: 24, minHeight: 360 }}>

<Footer style={{ textAlign: 'center', height:"48px", padding:0,

lineHeight:"48px",}}>通用后台管理系统 ©2022 Created by 前端乐哥</Footer>

十二、侧边栏的点击实现跳转

12.1、侧边栏的点击事件

Home组件中：Menu上添加点击事件：

const items: MenuItem[] = [

getItem('栏目 1', '1', <PieChartOutlined />),

getItem('栏目 2', 2, <DesktopOutlined />),

getItem('User', 'sub1', <UserOutlined />, [

getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'),

getItem('Team 2', '8')]),

getItem('Files', '9', <FileOutlined />),

const menuClick = (e:{key:string}) =>{

console.log(e.key); // ！！！【重点】获取点击到的key就是上面的这些数字，所以我们需要

<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items}

【重点】 console.log(e.key); 获取点击到的key就是上面的这些数字，所以我们需要把上面的key换 成对应路径

const items: MenuItem[] = [

getItem('栏目 1', '/page1', <PieChartOutlined />),

getItem('栏目 2', '/page2', <DesktopOutlined />),

getItem('User', 'sub1', <UserOutlined />, [

getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'),

getItem('Team 2', '8')]),

getItem('Files', '9', <FileOutlined />),

12.2、配置点击跳转和占位符的展示窗口

Home组件中：

import {Outlet,useNavigate} from "react-router-dom"

const View: React.FC = () => {

const navigateTo = useNavigate();

const menuClick = (e:{key:string}) =>{

{/* console.log(e.key);*/}

<Content style={{ margin: '16px 16px 0' }} className="site-layoutbackground">

注意：嵌套路由的占位符展示窗口需要用Outlet组件，这里和根路由的展示有所区别

此时还需要配置路由才能实现点击跳转

12.3、嵌套路由的配置

路由中还需要配置，在router/index.tsx 中进行修改：（记得在views中准备好Page1和Page2两个组 件）

import React,{ lazy } from "react"

import {Navigate} from "react-router-dom"

import Home from "../views/Home"

const Page1 = lazy(()=>import("../views/Page1"))

const Page2 = lazy(()=>import("../views/Page2"))

const withLoadingComponent = (comp:JSX.Element) => (

<React.Suspense fallback={<div>Loading...</div>}>

// 嵌套路由 开始-------------------

element:<Navigate to="/page1"/>

element: withLoadingComponent(<Page1 />)

element: withLoadingComponent(<Page2 />)

// 嵌套路由 结束-------------------

// element: withLoadingComponent(<About />)

// element: withLoadingComponent(<User />)

了解来自React18的警告

打开控制台，如果看到如下警告：

/* react-dom.development.js:86 Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switchto-createroot */

课件React18已经不再支持ReactDOM.render。使用createRoot来代替。

所以，index.js中，代码改成(才不会有警告)： 

import * as ReactDOMClient from 'react-dom/client';

const container = document.getElementById('root');

const root = ReactDOMClient.createRoot(container);

// Initial render: Render an element to the root.