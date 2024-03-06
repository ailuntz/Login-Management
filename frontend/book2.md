9.2、方法名的统一管理
handleNum.actions[handleNum.add1](newState,action) // 可能划红色曲线警告

handleNum.actions[handleNum.add2](newState,action) // 可能划红色曲线警告

解决 handleNum.actions[handleNum.actionName2] 的红色曲线警告：

我们在项目中的 tsconfifig.json 文件中添加： "suppressImplicitAnyIndexErrors":true, 选项，重启

Vscode ！

详细查看官方文档： https://www.typescriptlang.org/tsconfifig#suppressImplicitAnyIndexErrors

"suppressImplicitAnyIndexErrors":true,

十、【重点】ReactRedux的模块化配置

上面的模块化还不够彻底，如果模块多了 reducer.js 中就会有变得很长而且很乱，所有的模块都要在

reducer.js 中过一遍。

如何优把 reducer 也模块化到各个功能模块中？？ 利用 combineReducers

/src/store/index.ts

import { legacy_createStore,combineReducers } from "redux";

import handleArr from './ArrStatus/reducer';

import handleNum from './NumStatus/reducer';

const reducers = combineReducers({

const store = legacy_createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__

&& window.__REDUX_DEVTOOLS_EXTENSION__());

在 /src/store/NumStatus 中新建 reducer.ts

import handleNum from "./";

let reducer = (state = {...handleNum.state}, action:{type:string,val:number}) =>

let newState = JSON.parse(JSON.stringify(state))

handleNum.actions[handleNum.add1](newState,action)

handleNum.actions[handleNum.add2](newState,action)

在配置多一个模块：

新建 /src/store/ 中 ArrStatus 文件夹，下新建 index.ts 和 reducer.ts

/src/store/ArrStatus/index.ts 中：

sarrpush(newState,action){

newState.sarr.push(action.val)

/src/store/ArrStatus/reducer.ts 中：

import handleArr from "./"

let reducer = (state = {...handleArr.state}, action:{type:string,val:number}) =>

let newState = JSON.parse(JSON.stringify(state))

handleArr.actions[handleArr.sarrpush](newState,action)

最后需要在组件中修改获取数据的方式，才能在界面上正常看到数据：

const { num } = useSelector((state:RootState) => ({

const { sarr } = useSelector((state:RootState) => ({

sarr:state.handleArr.sarr

dispatch({ type: 'sarrpush',val:3 })

<button onClick={changeNum}>按钮</button>

<button onClick={changeArr}>按钮2</button>

十一、【重点】ReactRedux代码优化

11.1、switch...case...语句自动生成

对于 reduce.ts 每次写一个方法，就要手动添加这个 case 的对比和执行，相当麻烦！

/src/store/NumStatus/index.ts 中：

add1(newState:{num:number},action:{type:string}){

add2(newState:{num:number},action:{type:string,val:number}){

newState.num +=action.val;

/src/store/NumStatus/reducer.ts 中：

// switch (action.type) {

// case handleNum.actionName1:

// handleNum.actions[handleNum.add1](newState,action)

// case handleNum.actionName2:

// handleNum.actions[handleNum.add2](newState,action)

// 【优化】这样就每次写一个方法就不需要手动来添加这句case和执行，终于解放双手了！！

for(let key in handleNum.actionNames){

if(action.type===handleNum.actionNames[key]){

handleNum.actions[handleNum.actionNames[key]](newState,action)

11.2、方法名对象actionNames自动生成

/src/store/NumStatus/index.ts 中

add1(newState:{num:number},action:{type:string}){

add2(newState:{num:number},action:{type:string,val:number}){

newState.num +=action.val;

// 自动生成 actionNames{add1:"add1", add2:"add2"} 对象

for(let key in store.actions){

store.actionNames=actionNames

11.3、完善各个模块的reducer和ArrStatus的代码

所有模块的 reducer 最终处理成：

import handler from "./";

let reducer = (state = {...handler.state}, action:{type:string}) => {

let newState = JSON.parse(JSON.stringify(state))

for(let key in handler.actionNames){

if(action.type===handler.actionNames[key]){

handler.actions[handler.actionNames[key]](newState,action)

src/store/ArrStatus/index.ts 最终也处理成：

sarrpush(newState:{sarr:number[]},action:{type:string,val:number}){

newState.sarr.push(action.val)

for(let key in store.actions){

store.actionNames=actionNames