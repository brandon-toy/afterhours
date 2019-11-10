const ytdl = require('ytdl-core-discord')
const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

const commandInit = '!aft'

const commands = {
    "mcServer": commandInit + " mc server",
    "leave": commandInit + " leave",
    "list": commandInit + " list",
    "random": commandInit + " shuffle"
}

const memeSongs = {
    "!aft running90s": "https://www.youtube.com/watch?v=dv13gl0a-FA",
    "!aft running90s10hrs": "https://www.youtube.com/watch?v=YP2mhJyHuCs",
    "!aft gas gas gas": "https://www.youtube.com/watch?v=4pJO4KMm_rU"
}

const music = {
    "!aft witcher": "https://www.youtube.com/watch?v=8GYL6c_GTE0",
    "!aft oblivion": "https://www.youtube.com/watch?v=h9WudJDkeBI",
    "!aft botw": "https://www.youtube.com/watch?v=cAASeTJQBjI",
    "!aft skyrimV": "https://www.youtube.com/watch?v=hBkcwy-iWt8",
    "!aft rivendell": "https://www.youtube.com/watch?v=62j1xAdYKAQ",
}

client.on('message', async msg => {
    if (msg.content == commandInit) {
        msg.reply('Hello there!')
    }
    if(msg.content in music) {
        msg.reply("Playing " +msg.content.split(" ")[1])
        msg.channel.send('url: '+music[msg.content])
        playURL(music[msg.content], msg)
    }

    if(msg.content == commands.mcServer) {
        console.log('yeet')
        msg.reply('Minecraft Server: ```142.4.206.183:25588```\nCurrently using Modpack: Roguelike Dungeons and Adventures\n\nTwitch Link: https://www.curseforge.com/minecraft/modpacks/roguelike-adventures-and-dungeons')
    }

    if(msg.content == commands.list) {
        msg.channel.send("Here's a list of the music so far ")
        msg.channel.send(Object.keys(music))
    }

    if(msg.content === commands.leave) {
        voiceChannelID = msg.member.voice.channelID;
        if (voiceChannelID != null) {
            botChannelID = voiceChannelID
            const channel = client.channels.get(voiceChannelID);
            channel.leave();
        } else {
            msg.reply('Are you in a voice channel?')
        }
    }
    if(msg.content == commands.random) {
        var randomProperty = function (obj) {
            var keys = Object.keys(obj)
            return obj[keys[keys.length * Math.random() << 0]];
        };
        msg.reply("playing random song from list")
        const random = randomProperty(music)
        msg.channel.send('url: '+random)
        playURL(random,msg)
    }
})

async function playURL(url, msg) {
    voiceChannelID = msg.member.voice.channelID;
    if (voiceChannelID != null) {
        botChannelID = voiceChannelID
        const channel = client.channels.get(voiceChannelID);
        channel.join().then(connection => {
            youtubeVideo(url, connection)
        }).catch(e => {
            console.error(e);
            msg.channel.send("Yikes error :( tell brandon")
        });
    } else {
        msg.reply('Are you in a voice channel?')
    }
}

async function youtubeVideo(url, connection) {
    const ytdlOptions = {
        filter: 'audioonly',
        quality: 'highestaudio',
        format: 'mp3',
        highWaterMark: 1 << 25,
    };
    const stream = ytdl(url, ytdlOptions);
    connection.play(await stream, { type: 'opus', highWaterMark: 1 });
}

client.login('NjM3MDYwMTA1ODI0NzYzOTI1.XbIxrw.aiXTf11pj-nDpibyMTBFbnhI-ig')