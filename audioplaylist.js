const fs = require("fs");
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const path = require("path");
const playlistId = "PLp5iAwTZ4LdFJV_e_OyvY1LhVUijWkiyf";
const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
const downloadPlaylist = async (playlistUrl) => {
  const playlist = await ytpl(playlistUrl);
  const { title } = playlist;
  const dir = path.join(__dirname, title);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const { items } = playlist;
  for (const item of items) {
    const { title, id } = item;
    const videoUrl = `https://www.youtube.com/watch?v=${id}`;
    await downloadVideo(videoUrl, dir, title);
  }
};

const downloadVideo = async (videoUrl, dir, title) => {
  return new Promise(async (resolve, reject) => {
    try {
      const showVideoInfo = await ytdl.getInfo(videoUrl);
      const format = showVideoInfo.formats.find(
        (format) => format.itag === 140
      );
      const audio = ytdl(videoUrl, { quality: format.itag });
      const writeStream = fs.createWriteStream(`${dir}/${title}.mp3`);
      audio.pipe(writeStream);
      audio.on("end", () => {
        console.log(`Downloaded: ${title}`);
        resolve();
      });
    } catch (error) {
      console.error("Error downloading video:", error);
    }
  });
};

downloadPlaylist(playlistUrl);
