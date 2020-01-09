
const ytdl = require('ytdl-core-discord');
const Discord = require('discord.js');

require('dotenv').config();

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


function getMusicList() {
  const keys = Object.keys(music);
  let list = '```';
  for (let i = 0; i < keys.length; i += 1) {
    list = list.concat(`${i + 1}. `, keys[i], '\n');
  }
  list = list.concat('```');
  return list;
}

function getMemeList() {
  const keys = Object.keys(memeSongs);
  let list = '```';
  for (let i = 0; i < keys.length; i += 1) {
    list = list.concat(`${i + 1}. `, keys[i], '\n');
  }
  list = list.concat('```');
  return list;
}

async function playURL(msg) {
  voiceChannelID = msg.member.voice.channelID;
  if (voiceChannelID != null) {
    joinVoiceChannelAndPlayURL(voiceChannelID);
  } else {
    msg.reply('Are you in a voice channel?');
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
  connection.play(await stream, { type: 'opus', highWaterMark: 1 })
    .on('speaking', (speaking) => {
      if (speaking == false && songQueue.length != 0) {
        songQueue.shift();
        console.log(songQueue);
        youtubeVideo(songQueue[0][1], connection);
      }
    });
}

async function joinVoiceChannelAndPlayURL(voiceChannelID) {
  const channel = client.channels.get(voiceChannelID);
  channel.join().then((connection) => {
    youtubeVideo(songQueue[0][1], connection);
  }).catch((e) => {
    console.error(e);
    msg.channel.send('Yikes error :( tell brandon');
  });
}

const commandInit = '!aft';

const commands = {
  play: `${commandInit} play {song name}`,
  mcServer: `${commandInit} mc server`,
  leave: `${commandInit} leave`,
  list: `${commandInit} list songs`,
  random: `${commandInit} shuffle`,
  add: `${commandInit} add`,
  viewQueue: `${commandInit} upnext`,
  skip: `${commandInit} skip`,
};

const memeSongs = {
  running90s: 'https://www.youtube.com/watch?v=dv13gl0a-FA',
  running90s10hrs: 'https://www.youtube.com/watch?v=YP2mhJyHuCs',
  'gas gas gas': 'https://www.youtube.com/watch?v=4pJO4KMm_rU',
  'jesus is the one': 'https://www.youtube.com/watch?v=-pypV-JPU1k',
};

const music = {
  witcher: 'https://www.youtube.com/watch?v=8GYL6c_GTE0',
  oblivion: 'https://www.youtube.com/watch?v=h9WudJDkeBI',
  botw: 'https://www.youtube.com/watch?v=cAASeTJQBjI',
  skyrimV: 'https://www.youtube.com/watch?v=hBkcwy-iWt8',
  rivendell: 'https://www.youtube.com/watch?v=62j1xAdYKAQ',
  wow: 'https://www.youtube.com/watch?v=Oeo2VCCtUZQ',
  tavern: 'https://www.youtube.com/watch?v=4r_5A6K7gu0',
  novigrad: 'https://www.youtube.com/watch?v=Da9S9yjZZP4',
  combat: 'https://www.youtube.com/watch?v=lAGm9MTyRJ8',
  jrpg: 'https://www.youtube.com/watch?v=ST7O766etus',
  tavern2: 'https://www.youtube.com/watch?v=fIuO3RpMvHg',
  octopath: 'https://www.youtube.com/watch?v=1-_OwGncF6c',
  ff7: 'https://www.youtube.com/watch?v=9FmKdjRhoy4',
};

const fields = {
  mcServer: 'Minecraft Server: ```142.4.206.183:25588```\nCurrently using Modpack: Roguelike Dungeons and Adventures\n\nTwitch Link: https://www.curseforge.com/minecraft/modpacks/roguelike-adventures-and-dungeons',
};

let songQueue = [];


/**
 * @Client Misc Commands
 */
client.on('message', async (msg) => {
  if (msg.content == commandInit) {
    msg.reply('Hello there!');
  }

  if (msg.content == '!aft help') {
    let commandStr = 'Here are the supported commands: \n';
    for (commandKey in commands) {
      commandStr = commandStr.concat(commands[commandKey], '\n');
    }
    msg.reply(commandStr);
  }

  if (msg.content === commands.mcServer) {
    msg.reply(fields.mcServer);
  }

  if (msg.content === commands.leave) {
    const voiceChannelID = msg.member.voice.channelID;
    if (voiceChannelID != null) {
      const channel = client.channels.get(voiceChannelID);
      channel.leave();
    } else {
      msg.reply('Are you in a voice channel?');
    }
  }
});

/**
 * @Client Song Commands
 */
client.on('message', async (msg) => {
  const songArray = msg.content.split(' ');
  const songText = songArray[songArray.length - 1];

  if (songArray[0] === commandInit && (songText in music || songText in memeSongs) && songArray.length === 2) {
    msg.reply(`Playing Song: ${msg.content.split(' ')[1]}`);
    const songURL = music[songText];
    msg.channel.send(`url: ${songURL}`);
    songQueue = [[songText, songURL]];
    playURL(msg);
  }

  if (msg.content === commands.skip) {
    msg.reply(`Skipping: ${songQueue[0][0]}`);
    songQueue.shift();
    if (songQueue.length <= 0) {
      msg.reply('No more songs in playlist');
      voiceChannelID = msg.member.voice.channelID;
      if (voiceChannelID != null) {
        botChannelID = voiceChannelID;
        const channel = client.channels.get(voiceChannelID);
        channel.leave();
      }
    } else {
      msg.reply(`Playing Song: ${songQueue[0][0]}`);
      songURL = songQueue[0][1];
      msg.channel.send(`url: ${songURL}`);
      playURL(msg);
    }
  }

  if (msg.content === commands.viewQueue) {
    let songList = '```';
    for (let i = 0; i < songQueue.length; i += 1) {
      songList = songList.concat(`${i + 1}. `, songQueue[i][0], '\n');
    }
    songList = songList.concat('```');
    msg.reply(songList);
  }

  if (songText in music && msg.content === `${commands.add} ${songText}`) {
    msg.reply(`Added ${songText} to queue`);
    songQueue.push([songText, music[songText]]);
  }

  if (msg.content == commands.list) {
    msg.channel.send("Here's a list of the music so far ");
    msg.channel.send(`Songs: \n${getMusicList()}`);
    msg.channel.send('-----------------------\n');
    msg.channel.send(`Other Songs: \n${getMemeList()}`);
  }

  if (msg.content == commands.random) {
    msg.reply('Getting random song');

    const randomProperty = function (obj) {
      const keys = Object.keys(obj);
      return keys[keys.length * Math.random() << 0];
    };

    const randomKey = randomProperty(music);
    const url = music[randomKey];

    songQueue.push([randomKey, url]);

    if (songQueue.length == 1) {
      msg.reply(`Playing random song: ${randomKey}`);
      msg.channel.send(`url: ${url}`);
      playURL(msg);
    } else {
      msg.reply(`Added random song to Queue: ${randomKey}`);
      msg.channel.send(`url: ${url}`);
    }
  }
});

client.login(process.env.BOT_TOKEN);
