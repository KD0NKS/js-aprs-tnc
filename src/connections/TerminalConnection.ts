import EventEmitter from 'events'
import SerialPort, { OpenOptions } from 'serialport'
import { TerminalConfiguration } from '../configurations/TerminalConfiguration';

const Readline = require('@serialport/parser-readline')

export class TerminalConnection extends EventEmitter {
    private _connection: SerialPort
    private _terminalConfig: TerminalConfiguration

    constructor(path: string, terminalConfiguration: TerminalConfiguration, options?: OpenOptions, callback?: SerialPort.ErrorCallback) {
        super()
        let isInitComplete = false
        const autoOpen = options.autoOpen ?? true

        this._terminalConfig = terminalConfiguration

        //options.autoOpen = false
        this._connection = new SerialPort(path, options, callback)

        /*
        this._connection.open((err) => {
            if(err)
                this.emit('error', err)
        })
        */

        this._connection.on('open', () => {
            const tc = this
            const p1 = this._connection.pipe(new Readline())

            p1.on('data', function (data: any) {
                if (this._isInitComplete)
                    tc.emit('data', data)
            })

            terminalConfiguration?.initCommands.forEach(cmd => {
                this.sendCommand(cmd)
            })

            isInitComplete = true

            tc.emit('open')
        })

        if(autoOpen === true)
            this._connection.open()
    }

    private sendCommand(command: string, callback?: any) {
        this._connection.write(`${command}\r`, 'ascii', err => {
            if (err)
                console.log(err)
            else
                this.emit('sent', `${command}`)
        })

        if (callback)
            callback()
    }

    public end(callback?: () => void) {
        this._terminalConfig.exitCommands.forEach(cmd => {
            this.sendCommand(cmd)
        })

        this._connection.end(callback)
    }
}