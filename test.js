const tts = require('./index.js');

tts.saveMP3('Oh my gosh! Les baguettes sont très bonnes oui oui.', 'test_en.mp3', ).then((absoluteFilePath) => {
    console.log('The file is saved: ' + absoluteFilePath);
}).catch((err) => {
    console.log(err);
})

const text_to_say = 'Les caractères utf-8 seraient testés dans le cadre de cet enregistrement français.';
tts.saveMP3(text_to_say, 'test_fr.mp3', 'fr').then((absoluteFilePath) => {
    console.log('The file is saved: ' + absoluteFilePath);
}).catch((err) => {
    console.log(err);
})