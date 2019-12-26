const fs = require('fs');
const request = require('request');
const BASE_URL = 'http://translate.google.com/translate_tts?';

class GTranslateTTS {

    constructor() {
        this.attributes = {
            ie: 'UTF-8',
            client: 'tw-ob',
            tl: 'EN-us'
        }
    }

    parseURL(text, lang) {

        if (lang) {
            this.attributes.tl = lang;
        }

        let path = BASE_URL;
        const keysAtt = Object.keys(this.attributes);

        for (let i = 0; i < keysAtt.length; i++) {
            path += keysAtt[i] + '=' + this.attributes[keysAtt[i]] + '&';
        }

        path += 'q=' + text + '&textLen=' + text.length;

        return path;
    };

    writeFile(filename, data) {
        if (filename.substring(filename.length - 4, filename.length) !== '.mp3') { // If the mp3 extension is missing then it's added
            filename += '.mp3';
        }

        const file = fs.createWriteStream(filename)
        file.write(data);
        file.end();

        return file.path;
    };

    saveMP3(text, fileName, lang) {

        const self = this;
        return new Promise(function (resolve, reject) {

            self.getMp3(text, lang).then(function (data) {

                const file = self.writeFile(fileName, data);
                resolve(fs.realpathSync(file));

            }).catch(function (err) {

                reject(err);

            });
        });
    };

    getMp3(text, lang) {

        let data = [];
        let path = this.parseURL(text, lang);

        return new Promise(function (resolve, reject) {

            if (typeof text === 'undefined' || text === '') {
                reject('Text input is missing.');
            }

            request
                .get({
                    headers: {
                        'Accept-Encoding': 'identity;q=1, *;q=0',
                        'Range': 'bytes=0-'
                    },
                    uri: path,
                    method: 'GET'
                })
                .on('data', function (chunk) {
                    data.push(chunk);
                })
                .on('end', function () {
                    resolve(Buffer.concat(data));
                })
                .on('error', function (err) {
                    reject(err);
                });
        });
    }
};


module.exports = new GTranslateTTS();