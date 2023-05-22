
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
require('events').EventEmitter.prototype._maxListeners = 0;
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const fs = require('fs');


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
    const globalArrayObject = [];
    request(options, async function (error, response) {
        if (error) throw new Error(error + new Date());
        const res = JSON.parse(response.body)
        const arrContact = []
        if (res.dialogs) {
            res.dialogs.forEach(el => {
                const y = el.id
                const a = [...y].splice(0, 11)
                arrContact.push([a.join(''), el.name])

            });
            console.log(arrContact)
            arrContact.forEach(contact => {
                var options = {
                    'method': 'GET',
                    'url': `https://wappi.pro/api/sync/messages/get?profile_id=2c69ae90-ce24&chat_id=${contact[0]}&limit=100`,
                    'headers': {
                        'Authorization': 'd1ef53ec05c096936e8e4f970a350ba44ac34dff'
                    }
                };
                request(options, async function (error, response) {
                    if (error) throw new Error(error);
                    const message = JSON.parse(response.body)

                    const textmess = [];
                    if (message.detail !== 'Messages not found') {
                        //   console.log('нет')
                        const mass = Object.entries(message.messages)
                        // console.log(mass)
                        const mess = mass[0][1].body
                        const messId = mass[0][1].id
                        const phone = mass[0][1].chatId
                        const senderName = mass[0][1].senderName
                        mass.forEach(el => {
                            textmess.push(el[1].body)
                            const info = { contact: contact[0], name: contact[1], time: dateConvert(el[1].time), from: el[1].senderName, message: el[1].body }
                            // console.log(info)
                            globalArrayObject.push(info)
                        })
                        console.log([[...phone].splice(0, 11).join(''), mess, messId, senderName, textmess, contact[1]]);
                        console.log(textmess)
                        let word = false;
                        textmess.forEach(el => {
                            el.split(' ')
                            if (el.includes('ссылка')) {
                                word = true
                            }
                        })
                        if (mess && !textmess.includes("Вас приветствует компания Курсор, Как ваше имя?")) {
                            console.log('первое сообщение')
                            var options = {
                                'method': 'POST',
                                'url': 'https://wappi.pro/api/sync/message/reply?profile_id=2c69ae90-ce24',
                                'headers': {
                                    'Authorization': 'd1ef53ec05c096936e8e4f970a350ba44ac34dff'
                                },
                                body: `{\r\n "body": "Вас приветствует компания Курсор, Как ваше имя?",\r\n  "message_id": "${messId}"\r\n}`
                            };
                            request(options, async function (error, response) {
                                if (error) throw new Error(error);
                                console.log(response.body);
                            });
                            return
                        }
                        if (textmess.includes('Вас приветствует компания Курсор, Как ваше имя?')
                            && mess !== 'Вас приветствует компания Курсор, Как ваше имя?'
                            && !textmess.includes('Как называется ваша компания и чем занимается?')) {
                            console.log('2')
                            var options = {
                                'method': 'POST',
                                'url': 'https://wappi.pro/api/sync/message/reply?profile_id=2c69ae90-ce24',
                                'headers': {
                                    'Authorization': 'd1ef53ec05c096936e8e4f970a350ba44ac34dff'
                                },
                                body: `{\r\n    "body": "Как называется ваша компания и чем занимается?",\r\n    "message_id": "${messId}"\r\n}`
                            };
                            request(options, async function (error, response) {
                                if (error) throw new Error(error);
                                console.log(response.body);
                            });
                            return
                        }
                        if (textmess.includes('Как называется ваша компания и чем занимается?')
                            && mess !== 'Как называется ваша компания и чем занимается?'
                            && word === false) {
                            console.log('2')
                            let name;
                            textmess.forEach((el, i, arr) => {
                                if (el === 'Вас приветствует компания Курсор, Как ваше имя?' && i < arr.length - 1) {
                                    name = arr[i - 1]
                                }
                            })
                            var options = {
                                'method': 'POST',
                                'url': 'https://wappi.pro/api/sync/message/reply?profile_id=2c69ae90-ce24',
                                'headers': {
                                    'Authorization': 'd1ef53ec05c096936e8e4f970a350ba44ac34dff'
                                },
                                body: `{\r\n    "body": "${name}, ваша ссылка ${url}",\r\n    "message_id": "${messId}"\r\n}`
                            };
                            request(options, async function (error, response) {
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
                    }
                    else {
                        console.log('3')
                        console.log('молчим')
                        return
                    }
                }
                );
            })
            setTimeout(excelfn, 200, globalArrayObject)
        }
    })
}
findChat()
setInterval(findChat, 10000)


const url = 'https://drive.google.com/file/d/1fyTwE4KltYtABSncBk5EsQdCrh18CN9E/view?usp=share_link'
function excelfn(info) {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    worksheet.columns = [
        { header: 'Контакт', key: 'contact', width: 20 },
        { header: 'Имя', key: 'name', width: 20 },
        { header: 'Время', key: 'time', width: 20 },
        { header: 'Отправитель', key: 'from', width: 20 },
        { header: 'Сообщение', key: 'message', width: 20 }
    ];
    info.forEach(it => worksheet.addRow(it))

    workbook.xlsx.readFile('contacts.xlsx')
        .then(() => {
            const worksheet = workbook.getWorksheet('Sheet1');
            let rowExists = false;

            info.forEach(it => {
                worksheet.eachRow(row => {
                    if (row.getCell(3).value === it.time) {
                        rowExists = true;
                    }
                });

                if (!rowExists) {
                    worksheet.addRow([it.contact, it.name, it.time, it.from, it.message]);
                }
            });

            return workbook.xlsx.writeFile('contacts.xlsx');
        })
        .catch(() => {
            // Если Excel файл не существует, создаем новый файл и добавляем в него новую строку
            workbook.xlsx.writeFile('contacts.xlsx')
                .then(() => {
                    const worksheet = workbook.addWorksheet('Sheet1');
                    info.forEach(it => {
                        worksheet.addRow(it)
                    })
                    return workbook.xlsx.writeFile('contacts.xlsx');
                })
                .then(() => {
                    console.log('Файл сохранен');
                })
                .catch(error => {
                    console.log(error.message);
                });
        });
}

function dateConvert(time) {
    const date = new Date(time * 1000); // умножаем на 1000, так как время в js задается в миллисекундах
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    const formatted_date = `${day}.${month}.${year} ${hours}: ${minutes}: ${seconds}`;
    return formatted_date
}

const http = require('http');
const optionss = {
    hostname: 'localhost',
    port: 5000,
    path: '/',
    method: 'GET'
};

function connectToServer() {
    const req = http.request(optionss, (res) => {
        console.log(`Connected to server! Status code: ${res.statusCode} `);
    });

    req.on('error', (error) => {
        console.log(`Error connecting to server: ${error.message} `);
        setTimeout(connectToServer, 2000);
    });

    req.end();
}

connectToServer();


module.exports = app