const fs = require("fs");
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const path = require("path");

const playlistId = "PLbVdwtmx18sunKVMNYbUBj4-GuWxE3Dsj";
const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;

const downloadPlaylist = async (playlistUrl) => {
  try {
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
  } catch (error) {
    console.error("Error downloading playlist:", error);
  }
};

// const downloadVideo = async (videoUrl, dir, title) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const video = ytdl(videoUrl);
//       const writeStream = fs.createWriteStream(`${dir}/${title}.mp4`);

//       video.pipe(writeStream);

//       video.on("end", () => {
//         console.log(`Downloaded: ${title}`);
//         resolve();
//       });

//       video.on("error", (error) => {
//         console.error(`Error downloading video ${title}:`, error);
//         reject(error);
//       });
//     } catch (error) {
//       console.error(`Error downloading video ${title}:`, error);
//       reject(error);
//     }
//   });
// };
const downloadVideo = async (videoUrl, dir, title) => {
  return new Promise(async (resolve, reject) => {
    try {
      const video = ytdl(videoUrl, {
        filter: "audioandvideo",
        quality: "highest",
      });
      const writeStream = fs.createWriteStream(`${dir}/${title}.mp4`);

      video.pipe(writeStream);

      video.on("end", () => {
        console.log(`Downloaded: ${title}`);
        resolve();
      });

      video.on("error", (error) => {
        console.error(`Error downloading video ${title}:`, error);
        reject(error);
      });
    } catch (error) {
      console.error(`Error downloading video ${title}:`, error);
      reject(error);
    }
  });
};

downloadPlaylist(playlistUrl);
