const axios = require('axios'),
    fs = require('fs')

const {
    URL_XLIGTHS_COMMAND
} = require('./constants');


let saveDirectory = 'C:/xLights/Show2023/secuencias/simon_dice/'

const args = process.argv.slice(2);

var i = args[0]

let fileName = `simon_dice_ok`
let seq = `${saveDirectory}cientos/${fileName}_${i}.xsq`
let txt = saveDirectory + fileName + '.txt'
console.log('simon_dice_ok ' + seq + '\n')

fs.writeFileSync(txt, i + '')
// Abro la secuencia


axios.get(URL_XLIGTHS_COMMAND('openSequence' + '?force=False&seq=' + seq))
    .then(() => {
        axios.get(URL_XLIGTHS_COMMAND('renderAll'))
            .then(() => {
                axios.get(URL_XLIGTHS_COMMAND('saveSequence'))
                    .then(() => {
                        axios.get(URL_XLIGTHS_COMMAND('closeSequence'))

                    })

            })
    })




