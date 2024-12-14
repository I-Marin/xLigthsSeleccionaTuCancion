const axios = require('axios'),
    fs = require('fs')

const {
    URL_XLIGTHS_COMMAND
} = require('./constants');


let saveDirectory = 'C:/xLights/Show2023/secuencias/simon_dice/',
    fileName



async function render(seq) {
    await axios.get(URL_XLIGTHS_COMMAND('openSequence' + '?force=False&seq=' + seq))
    await axios.get(URL_XLIGTHS_COMMAND('renderAll'))
    await axios.get(URL_XLIGTHS_COMMAND('saveSequence'))
    await axios.get(URL_XLIGTHS_COMMAND('closeSequence'))
}

async function renderFull() {
    for (let i = 1; i <= 100; i++) {
        fileName = `simon_dice_ok`
        let seq = `${saveDirectory}cientos/${fileName}_${i}.xsq`
        let txt = saveDirectory + fileName + '.txt'
        console.log('simon_dice_ok ' + seq + '\n')

        fs.writeFileSync(txt, i + '')
        // Abro la secuencia

        await render(seq)
    }
}

renderFull()
