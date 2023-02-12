const TelegramApi = require('node-telegram-bot-api')
const token = '5937450742:AAFcLUfSb7HGDvxh5bpICK_6TK57Pbq7E10'
const bot = new TelegramApi(token, {polling: true})

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "Let's play a game, I'll think of a number from 0 to 9 and you have to guess what number I thought of")
    const number = Math.floor(Math.random(1)*10) 
    chats[chatId] = number
    await bot.sendMessage(chatId, 'Go ahead', gameOptions)
}

const chats  = {}
const gameOptions = { 
    reply_markup: JSON.stringify({
        inline_keyboard:[
            [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
            [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
            [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
            [{text: '0', callback_data: '0'}],
        ]
    })
}
const repeatOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard:[
            [{text: 'Play again', callback_data: '/again'}],
        ]
    })
}


const start = async () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра угадай цифру'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if (text === '/start') {
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
                return bot.sendMessage(chatId, `Добро пожаловать !`);
            }
            if (text === '/info') {
                return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
            }
            if (text === '/game') {
                return startGame(chatId);
            }
            return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!)');
        } catch (e) {
            return bot.sendMessage(chatId, 'Произошла какая то ошибочка!)');
        }
    })
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        switch(data){
        case '/again':
            return startGame(chatId)
            break;
        case chats[chatId]:
            await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, repeatOptions);
            break;
        default:
            await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, repeatOptions);
        }
    })
}
start() 