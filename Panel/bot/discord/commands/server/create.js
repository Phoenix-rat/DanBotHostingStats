const serverCreateSettings = require('../../../../createData');
const humanizeDuration = require('humanize-duration');
exports.run = async (client, message, args, cooldown) => {

    let helpEmbed = new Discord.MessageEmbed()
        .setColor(`RED`).setDescription(`List of servers: (use ${config.DiscordBot.Prefix}server create <type> <name>)`)
        .addField(`__**Minecraft:**__`, "Forge \nPaper \nBedrock \nPocketmineMP", true)
        .addField(`__**Grand Theft Auto:**__`, "FiveM \nalt:V \nmultitheftauto \nRage.MP \nSA-MP", true)
        .addField(`__**Bots:**__`, "NodeJS \nPython \nJava \naio \nRedDiscordBot", true)
        .addField(`__**Source Engine:**__`, "GMod \nCS:GO \nARK:SE", true)
        .addField(`__**Voice Servers:**__`, "TS3 \nMumble", true)
        .addField(`__**SteamCMD:**__`, "Rust", true)
        .addField(`__**Databases:**__`, "MongoDB \nRedis \nPostgres", true)
        .addField(`__**WebHosting:**__`, "Nginx", true)
        //.addField(`__**Storage:**__`, "storage", true)
        .setFooter("Example: " + config.DiscordBot.Prefix + "server create NodeJS Testing Server")

    const serverName = message.content.split(' ').slice(3).join(' ') || "change me! (Settings -> SERVER NAME)";
    let consoleID = userData.get(message.author.id);

    if (consoleID == null) {
        message.channel.send("Oh no, Seems like you do not have an account linked to your discord ID.\n" +
            "If you have not made an account yet please check out `" +
            config.DiscordBot.Prefix + "user new` to create an account \nIf you already have an account link it using `" +
            config.DiscordBot.Prefix + "user link`");
        return;
    }
    let data = serverCreateSettings.createParams(serverName, consoleID.consoleID);

    if (!args[1]) {
        await message.channel.send(helpEmbed)
        return;
    }

    let types = {
        //storage: data.storage,
        nginx: data.nginx,
        reddiscordbot: data.reddiscordbot,
        nodejs: data.nodejs,
        python: data.python,
        aio: data.aio,
        java: data.java,
        paper: data.paper,
        forge: data.forge,
        fivem: data.fivem,
        "alt:v": data.altv,
        multitheftauto: data.multitheftauto,
        "rage.mp": data.ragemp,
        "sa-mp": data.samp,
        bedrock: data.bedrock,
        pocketminemp: data.pocketminemp,
        gmod: data.gmod,
        "cs:go": data.csgo,
        "ark:se": data.arkse,
        ts3: data.ts3,
        mumble: data.mumble,
        rust: data.rust,
        mongodb: data.mongodb,
        redis: data.redis,
        postgres: data.postgres,
    }

    if (Object.keys(types).includes(args[1].toLowerCase())) {

        if (cooldown[message.author.id].nCreate > Date.now()) {
            message.reply(`You're currently on cooldown, please wait ${humanizeDuration(cooldown[message.author.id].nCreate - Date.now(), {round: true})}`)
            return;
        }
        cooldown[message.author.id].nCreate = Date.now() + (1200 * 1000)

        if (args[1] === "aio" | args[1] === "java") {
            serverCreateSettings.createServer(types[args[1].toLowerCase()])
                .then(response => {
                    let embed = new Discord.MessageEmbed()
                        .setColor(`GREEN`)
                        .addField(`__**Status:**__`, response.statusText)
                        .addField(`__**Created for user ID:**__`, consoleID.consoleID)
                        .addField(`__**Server name:**__`, serverName)
                        .addField(`__**Type:**__`, args[1].toLowerCase())
                        .addField(`__**WARNING**__`, `**DO NOT USE JAVA TO RUN GAMESERVERS. IF THERE IS A GAME YOU ARE WANTING TO HOST AND IT DOES NOT HAVE A SERVER PLEASE MAKE A TICKET**`)
                    message.channel.send(embed)
                }).catch(error => {
                message.channel.send(new Discord.MessageEmbed().setColor(`RED`).addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`"))
            })
        } else {
            serverCreateSettings.createServer(types[args[1].toLowerCase()])
                .then(response => {
                    let embed = new Discord.MessageEmbed()
                        .setColor(`GREEN`)
                        .addField(`__**Status:**__`, response.statusText)
                        .addField(`__**Created for user ID:**__`, consoleID.consoleID)
                        .addField(`__**Server name:**__`, serverName)
                        .addField(`__**Type:**__`, args[1].toLowerCase())
                    message.channel.send(embed)
                }).catch(error => {
                message.channel.send(new Discord.MessageEmbed().setColor(`RED`).addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`"))
                cooldown[message.author.id].nCreate = Date.now() + (10 * 1000)
            })
        }
        return;
    }
    await message.channel.send(helpEmbed)
}