/*
import fs from 'fs'
import { TerminalConnection } from './src/connections/TerminalConnection'
import reader from 'readline'
import { TNCSettings } from './src/configurations/TNCSettings'

reader.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const configFile = fs.readFileSync('./examples/kantronics.json', 'utf-8')
const terminalConfig = Object.assign(new TNCSettings(), JSON.parse(configFile))

const conn = new TerminalConnection('COM5'
        , terminalConfig
        , {
            dataBits: 8
            , stopBits: 1
            , baudRate: 9800
            , parity: 'none'
            , autoOpen: true
            , rtscts: true
        }
        , (err: any) => {
            if (err)
                return console.log(`error: ${JSON.stringify(err.message)}`)
    })

conn.on('data', function (data: string) {
    console.log(data)
})

conn.on('sent', data => {
    console.log(`TNC send>> ${data}`)
})

process.stdin.on('keypress', (str, key) => {
    if(key.ctrl && key.name === 'c') {
        conn.end()
        process.exit()
    }
})

console.log("ctrl + c to quit.")
*/