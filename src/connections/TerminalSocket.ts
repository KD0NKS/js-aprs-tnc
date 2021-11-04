import _ from "lodash"
import SerialPort from 'serialport'
import { TerminalSettings } from '../configurations/TerminalSettings'

const Delimiter = require('@serialport/parser-delimiter')

export class TerminalSocket extends SerialPort {
    private _pipe: any
    private _options: TerminalSettings

    // TODO: override callback
    constructor(path: string, options: TerminalSettings, callback?: SerialPort.ErrorCallback) {
        super(path, options, callback)

        this._options = options
        this._pipe = this.pipe(new Delimiter({ delimiter: this._options.messageDelimeter }))

        this.on('open', (err) => {
            if (err)
                throw err

            _.each(this._options.initCommands, (command: string) => {
                this.sendCommand(command)
            })

            this.sendCommand(this._options.myCallCommand)
        })

        this._pipe.on('data', (data: string) => {
            this.emit('packet', data.toString().trim())
        })

        // TODO: Callback
    }

    public sendCommand(command: string, callback?: any) {   // TODO: Callback
        this.write(`${command}${this._options.messageDelimeter}`, this._options.charset, err => {
            if(err) {
                throw err
            } else {
                this.emit('sent', `${command}`)
            }
        })
    }

    public sendMyCallCommand(callback?: any) {
        if(this._options.myCallCommand != null
                && this._options.myCallCommand.trim().length > 0
                && this._options.callsign != null
                && this._options.callsign.trim().length > 0
                ) {
            this.sendCommand(this._options.myCallCommand, callback)
        }
        /*
        else if(this._options.myCallCommand == null
                || this._options.myCallCommand.trim().length == 0) {
            throw('No myCallCommand defined')
        } else if(this._options.callsign == null
                || this._options.callsign.trim().length == 0) {
            throw('No callsign defined')
        }
        */
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

    private runExitCommands() { // TODO: Callback
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