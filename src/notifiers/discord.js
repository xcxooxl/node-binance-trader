const Discord = require("discord.js")
const env = require("../env")
const SIGNAL_CHANNEL_ID = "836662003753418772"
const JAKE_SIGNAL_CHANNEL_ID = "834207626677846017"
const TEST_CHANNEL_ID = "833667548238184448"

let intents = new Discord.Intents(Discord.Intents.NON_PRIVILEGED)
intents.add("GUILD_MEMBERS")
const client = new Discord.Client({ ws: { intents: intents } })

client.on("ready", async () => {
    const testChannel = client.channels.cache.get(TEST_CHANNEL_ID);
    testChannel.send("bot restarted");
})

client.on("messageReactionAdd", async (reaction, user) => {
    const isJakeSignalChannel = reaction.message.channel.id === JAKE_SIGNAL_CHANNEL_ID
    const isThumbsUp = reaction.emoji.name === "👍"
    const isAuthorSignalBot = reaction.message.author.id === client.user.id
    if (!isThumbsUp || !isJakeSignalChannel || !isAuthorSignalBot) return

    const member = await reaction.message.guild.members.fetch(user.id)
    const hasPermissionToSignal = member.roles.cache.some(role => {
        const roleName = role.name.toLowerCase()
        return roleName === "leader" || roleName === "mod"
    })
    if (hasPermissionToSignal) {
        const signalChannel = client.channels.cache.get(SIGNAL_CHANNEL_ID)
        const [signalEmbed] = reaction.message.embeds
        signalChannel.send(signalEmbed)
    }
})

client.login(env.DISCORD_API_KEY)
const notifyNewSignal = async (channelId, type, ticker, price) => {
    const channel = await client.channels.cache.get(channelId)
    let text = `new signal order: ${type} ticker: ${ticker}`
    if (text)
        text += ` price: ${price}`
    channel.send(text)
}

const notifyJakeSignal = async (type, exchange, ticker, price, period = "") => {
    const channel = await client.channels.cache.get(JAKE_SIGNAL_CHANNEL_ID)
    const embed = new Discord.MessageEmbed()
    const title = [ticker, period, type].join(" - ")
    const symbol = `${exchange}:${ticker}`
    const url = `https://www.tradingview.com/chart?symbol=${encodeURIComponent(symbol)}`
    embed.addField(title, `
    price: ${price}
    exchange: ${exchange}
    [open graph](${url})`)
    const message = await channel.send(embed);
    message.react("👍");
}

// client.on('message', msg => {
//     if (msg.content === '!portfolio') {
//         msg.reply(`last detected portfolio was:\n ${memoryDB.db.lastPortfolio}`);
//     }
// });


module.exports = { notifyNewSignal, SIGNAL_CHANNEL_ID, JAKE_SIGNAL_CHANNEL_ID, notifyJakeSignal }
