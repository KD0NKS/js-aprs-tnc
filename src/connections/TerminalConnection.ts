import _ from "lodash"
import SerialPort from 'serialport'
import { TerminalSettings } from '../configurations/TerminalSettings'

const Delimiter = require('@serialport/delimiter-readline')

export class TerminalConnection extends SerialPort {
    private _pipe: any
    private _options: TerminalSettings

    constructor(path: string, options: TerminalSettings, callback?: SerialPort.ErrorCallback) {
        super(path, options, callback)

        this._options = options
        this._pipe = this.pipe(new Delimiter({ delimiter: this._options.messageDelimeter }))

        this.on('open', (err) => {
            if (err)
                throw err

            _.forEach(this._options.initCommands, (command: string) => {
                this.sendCommand(command)
            })
        })

        this._pipe.on('data', (data: string) => {
            this.emit('packet', data.trim())
        })
    }

    public sendCommand(command: string, callback?: any) {
        this.write(`${command}${this._options.messageDelimeter}`, this._options.charset, err => {
            if(err) {
                throw err
            } else {
                this.emit('sent', `${command}`)
            }
        })

        if(callback)
            callback()
    }

    public override end(cb?: () => void): void {
        _.forEach(this._options.exitCommands, (command: string) => {
            this.sendCommand(command)
        })

        setTimeout(() => {
            super.end(cb)
        }, 1000)
    }
}