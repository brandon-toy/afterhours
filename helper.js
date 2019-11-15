
function getMusicList() {
  const keys = Object.keys(music);
  let list = '```';
  for (let i = 0; i < songQueue.length; i += 1) {
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
  console.log(url);
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
