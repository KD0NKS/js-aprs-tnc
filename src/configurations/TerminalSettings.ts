export class TerminalSettings {
    public endOnClose?: boolean = false
    public path: string
    public hupcl?: boolean = true
    public callsign: string = ''
    public charset: 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'base64' | 'binary' | 'hex' = 'ascii'
    public exitCommands: string[] = []
    public messageDelimeter = '\r'
    public myCallCommand = ''
    public initCommands: string[] = []
    public autoOpen: boolean = false
    public baudRate: 115200 | 57600 | 38400 | 19200 | 9600 | 4800 | 2400 | 1800 | 1200 | 600 | 300 | 200 | 150 | 134 | 110 | 75 | 50 | number = 9600
    public dataBits: 8 | 7 | 6 | 5 = 8
    public highWaterMark: number = 65536
    public lock?: boolean = true
    public stopBits?: 1 | 2 = 1
    public parity: 'none' | 'even' | 'mark' | 'odd' | 'space' = 'none'
    public rtscts?: boolean = false
    public xany: boolean = false
    public xon: boolean = false
    public xoff: boolean = false
}