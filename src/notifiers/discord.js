const Discord = require('discord.js');
const env = require('../env');
const SIGNAL_CHANNEL_ID = '834188214935486544';
const TEST_CHANNEL_ID = '833667548238184448';

let intents = new Discord.Intents(Discord.Intents.NON_PRIVILEGED);
intents.add('GUILD_MEMBERS');
const client = new Discord.Client({ws: {intents: intents}});

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // setAllFollowers();
});

client.login(env.DISCORD_API_KEY);
const notifyNewSignal = async (type, ticker, price) => {
    const channel = await client.channels.cache.get(SIGNAL_CHANNEL_ID);
    channel.send(`new signal ${type} ${ticker} ${price}`);
}

// client.on('message', msg => {
//     if (msg.content === '!portfolio') {
//         msg.reply(`last detected portfolio was:\n ${memoryDB.db.lastPortfolio}`);
//     }
// });


module.exports = {notifyNewSignal}
