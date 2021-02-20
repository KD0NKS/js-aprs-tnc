import { TerminalConnection } from './src/connections/TerminalConnection'
import reader from 'readline'

reader.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const conn = new TerminalConnection('COM6'
        , {
            name: "Kantronics KAM-98 - 2m APRS"
            , initCommands: [
                "ECHO OFF"
                , "INT TERMINAL"
                , "CD SOFTWARE"
                , "LFADD OFF"
                , "AUTOLF ON"
                , "MONITOR ON"
                , "MCON OFF"
                , "MALL ON"
                , "MCOM OFF"
                , "MXMIT OFF"
                , "BEACON EVERY 0"
                , "BLT EVERY 0"
                , "UIDIGI OFF WIDE1-1"
                , "DIGIPEAT OFF"
                , "UIDWAIT OFF"
                , "PID OFF"
                , "HEADERLN OFF"
                , "PASSALL OFF"
                , "FLOW ON"
                , "HID OFF"
                , "MSTAMP OFF"
                , "NEWMODE OFF"
                , "XFLOW ON"
                , "HBAUD 1200"
            ]
            , exitCommands: [
                "DIGI OFF'"
                , "UIDIGI OFF WIDE1-1"
                , "BEACON EVERY 0"
                , "HID OFF"
                , "CD INTERNAL"
                , "INTFACE TERMINAL"
                , "ECHO ON"
            ]
        }
        , {
            dataBits: 8
            , stopBits: 1
            , baudRate: 9800
            , parity: 'none'
            //, autoOpen: false
            , rtscts: true
        }
        , (err: any) => {
            if (err)
                return console.log(`error: ${JSON.stringify(err.message)}`)
    })

conn.on('data', data => {
    console.log(data)
})

conn.on('sent', data => {
    console.log(data)
})

process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        conn.end()
        process.exit()
    }
})

console.log("ctrl + c to quit.")