import _ from "lodash"
import SerialPort from 'serialport'
import { TerminalSettings } from '../configurations/TerminalSettings'

const Delimiter = require('@serialport/parser-delimiter')

export class TerminalSocket extends SerialPort {
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
            this.emit('packet', data.toString().trim())
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

    public override close(cb?: () => void): void {
        try {
            this.runExitCommands()
        } catch(err) {
            throw err
        }

        setTimeout(() => {
            super.close(cb)
        }, 1000)
    }

    private runExitCommands() {
        try {
            _.forEach(this._options.exitCommands, (command: string) => {
                    this.sendCommand(command)
                })
        } catch (err) {
            throw err;
        }

        return
    }
}