// 设置xterm实例如何发送客户端输入和接受服务端输出

import { Terminal} from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import "xterm/css/xterm.css";

export class TerminalUI{
    // 创建一个xterm实例,设置背景和字体颜色
    constructor(socket) {
        this.term = new Terminal({
            theme:{
                background:'black',
                foreground:"#F5F8FA"
            },
        });
        // xterm实例——对应一个soccet连接
        this.socket = socket;
    }
    /**
     * 为UI和socket.io客户端附加事件监听器
     */
    startListening() {
        
        this.term.onData(data => {
            this.sendInput(data);
        }); 

        this.socket.on('output', data => {
            this.term.write(data);
        });
    }

    /**
     * 打印 终端提示信息
     */
    write(data) {
        this.term.write(data);
    }

    /**
    *   打印新行 
    */
    prompt() {
        this.term.write('\r\n$ ');
    }

    /**
    * 将终端输入的信息发送到服务端到PIY进程
    */
    sendInput(data) {
        this.socket.emit('input', data);
    }

    attachTo(container) {
        // 关联DOM元素并加载Fit组建
        let fitAddon = new FitAddon();
        this.term.loadAddon(fitAddon);
        this.term.open(container);
        fitAddon.fit();
        // 终端默认文本
        this.term.write('Welcome to PYPI\r\n');
        this.term.write('$ ');
        this.prompt();
    }

    clear() {
        this.term.clear();
    }

}