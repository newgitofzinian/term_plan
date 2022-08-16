// SocketSrtvice.js

// Manage Socket.IO Service
const SocketIO = require('socket.io');
const PTYServer = require('./PTYService');

class SocketService {
    constructor(server) {
        // 全局MAP保存socket与终端进程的映射关系
        this.socketMap = new Map();
    }

    attachServer(server) {
        if(!server) {
            throw new Error('server is required');
        }

        // 创建一个socket.io实例
        const io = SocketIO(server);
        // 打印成功标识
        console.log('Socket.IO Service is running');
        // 任何用户连接时发生连接事件
        io.on('connection', socket => {
            // 提示socket.id成功连接
            console.log(`${socket.id} connected`);
            // 断开连接时记录
            socket.on('disconnect', () => {
                console.log(`${socket.id} disconnected`);
                this.socketMap.delete(socket.id);
            });

            // 创建终端服务
            let pty = new PTYServer(socket);

            // 将socket与终端进程映射关系保存到MAP中
            this.socketMap.set(socket.id, pty);

            // 当客户端发送数据时，将数据发送到终端进程
            socket.on('input', data => {
                let pty = this.socketMap.get(socket.id);
                if(pty) {
                    pty.write(data);
                }
            });
            
            
        });
    }
}

module.exports = SocketService;