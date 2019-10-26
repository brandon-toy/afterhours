const file = require('./config.json')
const ytdl = require('ytdl-core-discord')
const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})



const commandInit = '!aft'

const commands = {
    "mcServer": commandInit + "mc server",
    "leave": commandInit + " leave",
    "list": commandInit + " list",
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
        msg.reply("playing " +msg.content.split(" ")[1])
        msg.channel.send('url: '+music[msg.content])
        playURL(music[msg.content], msg)
    }

    if(msg.content === commands.mcServer) {
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

client.login(file.discordBotId)