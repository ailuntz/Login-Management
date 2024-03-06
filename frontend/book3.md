React通用后台管理系统-笔记3
一、react-redux的异步解决方案redux-thunk

在 store/NumStatus/index.ts 中做异步操作：

add1(newState:{num:number},action:{type:string}){

会发现这种写法其实达不到想要的异步效果，需要通过 redux 相关的异步方案来解决（市面上有 redux

saga ， redux-thunk ），今天我们使用 redux-thunk 来做。

redux-thunk 相比于 redux-saga ，体积小，灵活，但需要自己手动抽取和封装。但学习成本较低。

项目目录下安装 redux-thunk

npm i redux-thunk
在 store/index.ts 中：

import { legacy_createStore,combineReducers,applyMiddleware,compose } from

import reduxThunk from 'redux-thunk' //rt

import handleArr from './ArrStatus/reducer.ts';

import handleNum from './NumStatus/reducer.ts';

const reducers = combineReducers({

// const store = legacy_createStore(reducers,

window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// 判断有没有__REDUX_DEVTOOLS_EXTENSION_COMPOSE__这个模块

let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?

window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}):compose //rt

// 把仓库数据，浏览器redux-dev-tools，还有reduxThunk插件关联在store中

legacy_createStore(reducers,composeEnhancers(applyMiddleware(reduxThunk))); //rt

在 src/views/Page1.tsx 组件中：

const changeNum2 = () =>{

dispatch((dis:Function)=>{

dis({type:'redu1',val:n})

const { sarr } = useSelector((state:RootState) => ({

sarr:state.handleArr.sarr

dispatch({ type: 'sarrpush',val:3 })

<button onClick={changeNum}>同步按钮</button>

<button onClick={changeNum2}>异步按钮</button>

但上面这样写就把数据操作和项目业务混在一起了，这也是 redux-think 本身的缘故，需要自己手动优

化封装函数进行优化！！！

二、手动封装redux-thunk的异步函数

上面 redux-thunk 的写法可以看出， dispatch 调用传入的是一个 actions 函数，接下来我们把这个函数抽

取到状态管理中作为一个方法的返回值。

在 store/Numstatus/index.ts 中的 store 对象中添加：

// 优化redux-thunk的异步写法(模仿Vuex的写法)

asyncActions:{ // 只放异步的方法

asyncAdd1(dispatch:Function){

而 src/views/Page1.tsx 组件中的 changeNum2 修改成：

import numStatus from "@/store/NumStatus"

const changeNum2 = () =>{

// dispatch((dis:Function)=>{

// dis({type:'redu1',val:n})

// 但上面这样写就把数据操作和项目业务混在一起了

// dispatch(调用状态管理中的asyncAdd1)

dispatch(numStatus.asyncActions.asyncAdd1)

至此， react 状态管理模块的封装完成！

三、数据交互的解决方案

3.1、axios封装和apis的抽取

安装 axios

npm i axios
/src 下新建 request 文件夹，并新建 index.ts

import axios from "axios"

const instance = axios.create({

baseURL:"http://xue.cnkdl.cn:23683",

// 这个时间是你每次请求的过期时间，这次请求认为20秒之后这个请求就是失败的

instance.interceptors.request.use(config=>{

return Promise.reject(err)

instance.interceptors.response.use(res=>{

return Promise.reject(err)

/src/request 下新建 api.ts

import request from "./index"

export const captchaAPI = () => request.get("/prod-api/captchaImage");

Login.tsx 中：

import { captchaAPI } from "@/request/api.ts"

const getCaptchaImg = ()=>{

captchaAPI().then(res=>{ // 划红色曲线警告

四、res划红色曲线警告的解决

res 必须为请求回来的类型的数据，需要添加类型。

建议安装 VSCode 的 JSON to TS 扩展。 ( 快捷键： ctrl+shift+alt+v)

在浏览器中复制请求到的数据，粘贴，按下 ctrl+shift+alt+v ，就能得到类型该 res 数据的类型。起个名

字就可以用了！

在 src/types 文件夹中新建 api.d.ts ，把上面生成的类型粘贴进去：

Login.tsx 中：

const getCaptchaImg = ()=>{

captchaAPI().then((res:CaptchAPIRes)=>{

把上面代码换成 async+await 的写法：

const getCaptchaImg = async ()=>{

// CaptchaAPI().then((res:CaptchAPIRes)=>{

// console.log(res.code);

let captchAPIRes = await CaptchaAPI()

console.log(captchAPIRes.code);

五、规范化请求中TypeScript的书写

请求中请求参数和函数类型都需要进行约束！

src/request/api.ts 中：

// 统一管理项目中所有的请求路径 api

import request from "./index"

// 验证码请求

export const CaptchaAPI = (): Promise < CaptchAPIRes > => request . get ( "/prod

api/captchaImage" );

六、完成点击验证码业务 

Login 组件中：

const [captchaImg,setCaptchaImg] = useState("");

window.onresize = function(){initLoginBg()};

const getCaptchaImg = async ()=>{

let captchAPIRes:CaptchAPIRes = await CaptchaAPI()

setCaptchaImg("data:image/gif;base64,"+captchAPIRes.img)

localStorage.setItem("uuid",captchAPIRes.uuid)

七、测试登录请求

/src/request/api.ts 中：

export const loginAPI = (params:LoginAPIReq) => request.post("/prodapi/login",params);
/src/types/api.d.ts 中：

Login.tsx 中：

import { Input,Space,Button,message} from 'antd';

import { CaptchaAPI,loginAPI } from "@/request/api.ts"

import { useNavigate } from "react-router-dom"

const [captchaImg,setCaptchaImg] = useState("");

const navigateTo = useNavigate()

const gotoLogin = async ()=>{

// console.log("用户输入的用户名，密码，验证码分别

是：",usernameVal,passwordVal,captchaVal);

if(!usernameVal.trim()|| !passwordVal.trim()|| !captchaVal.trim()){

message.warning('请完整输入信息！');

let loginAPIRes:LoginAPIRes = await loginAPI({

uuid: localStorage.getItem("uuid")

console.log(loginAPIRes);

if(loginAPIRes.code===200){

message.success('登录成功！');

localStorage.setItem("lege-react-management-token",loginAPIRes.token)

八、手动封装前置路由守卫

App.tsx 中：

import { useEffect } from 'react'

import { useRoutes, useLocation,useNavigate } from "react-router-dom"

import router from "./router"

import { message } from "antd"

  const navigateTo = useNavigate()

    navigateTo("/login");

    message.warning("您还没有登录，请登录后再访问！");

  const navigateTo = useNavigate()

    navigateTo("/page1");

    message.warning("您已经登录过了！");

function BeforeRouterEnter(){

  const outlet = useRoutes(router);

    1、如果访问的是登录页面， 并且有token， 跳转到首页

    2、如果访问的不是登录页面，并且没有token， 跳转到登录页

    const location = useLocation()

    let token = localStorage.getItem("lege-react-management-token");

    //1、如果访问的是登录页面， 并且有token， 跳转到首页

    if(location.pathname==="/login" && token){

      // 这里不能直接用 useNavigate 来实现跳转 ，因为需要BeforeRouterEnter是一个正常的JSX组件

    //2、如果访问的不是登录页面，并且没有token， 跳转到登录页

    if(location.pathname!=="/login" && !token){

    <div className="App">

      {/* <Link to="/home">Home</Link> |

      <Link to="/about">About</Link> |

      <Link to="/user">User</Link> */}

      {/* 占位符组件，类似于窗口，用来展示组件的，有点像vue中的router-view */}

      {/* <Outlet></Outlet> */}

      <BeforeRouterEnter />