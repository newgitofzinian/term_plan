// 导入TerminalUI模块
import { TerminalUI } from './TerminalUI';
import io from 'socket.io-client';

// 服务端监听地址
const serverUrl = 'http://localhost:3000';

// 连接服务端并返回一个socket函数
function connectServer() {
    return new Promise((resolve, reject) => {
        const socket = io(serverUrl);
        socket.on('connect', () => {
            resolve(socket);
        });
        // 连接失败   
        socket.on('connect_error', () => {
            reject('connect_error');
        })
    });
}

// 连接服务端，并且给终端设置相关联的DOM

// 开启一个终端函数
function startTerminal(container, socket)  {
    // 创建一个xterm.js实例
    const term = new TerminalUI(socket)

    // 将终端实例添加到指定的容器中
    term.attachTo(container);

    // 开始监听终端输入、输出
    term.startListening();
}


// 开始函数
function start() {
    // 获取DOM元素作为terminal的容器
    const container = document.getElementById('terminal-container');

    // 连接 sockert
    connectServer(serverUrl).then(socket => {
        // 开启一个终端
        startTerminal(container, socket);
    });
}

start();
