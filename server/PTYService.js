// PTYService.js

const os = require('os');
const pty = require('node-pty');
const { write } = require('fs');

class PTY {
    constructor(socket) {
        // 根据用户操作系统来选择终端
        this.os = os.platform() === 'win32' ? 'windows' : 'linux';
        this.ptyProcess = null;
        this.socket = socket;

        // 初始化PTY进程
        this.initPTY();
    }

    // 初始化PTY进程
    initPTY() {
        this.ptyProcess = pty.spawn(this.shell, [], {
            name: 'xterm-color',
            // 终端开始的路径
            cwd: process.env.HOME,
            // 终端的环境变量
            env: process.env,
        });

        // 添加数据到监听器
        this.ptyProcess.on('data', data => {
            // 终端生成任何数据，将该输出发送到客户端并显示
            this.sendToClient(data);
        });

        // 终端错误信息
        this.ptyProcess.on('error', err => {
            console.log(err);
        });

        // 将函数输入发送到终端进程
        write(data)
        {
            this.ptyProcess.write(data);
        } 


        // 终端生成数据，送至客户端
        sendToClient(data) {
            this.socket.emit('output', data);
        }

}

module.exports = PTY;