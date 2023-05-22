
const express = require('express')
const bodyParser = require('body-parser')
const whatsAppClient = require("@green-api/whatsapp-api-client");
const qrcode = require('qrcode');
//const isToken = require('./middleware/auth.js')
const app = express();
require('events').EventEmitter.prototype._maxListeners = 0;

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())



//app.use(routes)


console.log('Привет я бот')



var request = require('request');
var options = {
    'method': 'GET',
    'url': 'https://wappi.pro/api/sync/chats/get?profile_id=2c69ae90-ce24&limit=100',
    'headers': {
        'Authorization': ' d1ef53ec05c096936e8e4f970a350ba44ac34dff'
    }
};

async function findChat() {
    request(options, function (error, response) {
        if (error) throw new Error(error);
        //  console.log(JSON.parse(response.body));
        const res = JSON.parse(response.body)
        const arrContact = []
        res.dialogs.forEach(el => {
            const y = el.id
            const a = [...y].splice(0, 11)
            arrContact.push(a.join(''))

        });
        console.log(arrContact)

        arrContact.forEach(contact => {
            var options = {
                'method': 'GET',
                'url': `https://wappi.pro/api/sync/messages/get?profile_id=2c69ae90-ce24&chat_id=${contact}&limit=100`,
                'headers': {
                    'Authorization': 'd1ef53ec05c096936e8e4f970a350ba44ac34dff'
                }
            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                const message = JSON.parse(response.body)
                const mass = Object.entries(message.messages)
                const textmess = [];
                mass.forEach(el => {
                    textmess.push(el[1].body)
                })
                textmess.shift()
                console.log(textmess)
                const phone = mass[0][1].chatId
                const mess = mass[0][1].body
                const messOld = mass[1][1].body
                const messId = mass[0][1].id
                const senderName = mass[0][1].senderName
                console.log([[...phone].splice(0, 11).join(''), mess, messId, senderName]);

                console.log(messOld)
                console.log(mess)
                if (mess === 'Привет' && senderName !== 'Cursor-gps') {
                    console.log('повторный привет')
                    console.log(textmess.includes('Привет'))
                    if (textmess.includes('Привет') === false) {
                        console.log('первый привет')
                        var options = {
                            'method': 'POST',
                            'url': 'https://wappi.pro/api/sync/message/reply?profile_id=2c69ae90-ce24',
                            'headers': {
                                'Authorization': 'd1ef53ec05c096936e8e4f970a350ba44ac34dff'
                            },
                            body: `{\r\n "body": "Как ваше имя?",\r\n  "message_id": "${messId}"\r\n}`
                        };
                        request(options, function (error, response) {
                            if (error) throw new Error(error);
                            console.log(response.body);
                        });
                    }
                    return
                }
                if (messOld === 'Как ваше имя?') {
                    console.log('2')
                    var options = {
                        'method': 'POST',
                        'url': 'https://wappi.pro/api/sync/message/reply?profile_id=2c69ae90-ce24',
                        'headers': {
                            'Authorization': 'd1ef53ec05c096936e8e4f970a350ba44ac34dff'
                        },
                        body: `{\r\n    "body": "${mess} ваша ссылка www.presentacia.ru",\r\n    "message_id": "${messId}"\r\n}`
                    };
                    request(options, function (error, response) {
                        if (error) throw new Error(error);
                        console.log(response.body);
                    });
                    return
                }
                else {
                    console.log('3')
                    console.log('молчим')
                    return
                }
            });
        })
    })
}
findChat()
setInterval(findChat, 10000)


/*

const TelegramBot = require('node-telegram-bot-api');
const TOKEN = '6142704229:AAGn8h23dUZ7hTGaRIQquCgxAmLehb6Otjg';
const bot = new TelegramBot(TOKEN, { polling: true });

bot.on('message', (response) => {
    console.log(response);
    const { id, first_name, last_name, username, contact } = response.chat;
    bot.sendMessage(id, `Привет, ${first_name}! Я бот, который может помочь тебе. Какой вопрос у тебя есть?`);

    if (contact) {
        const { phone_number } = contact;
        bot.sendMessage(id, `Спасибо, ${first_name}! Мы получили твой номер телефона: ${phone_number}`);
    }

    bot.sendMessage(id, `Вот ссылка на сайт, который тебе может быть интересен: http://example.com`);
});*/



module.exports = app