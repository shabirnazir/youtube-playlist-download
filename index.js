// const fs = require("fs");
// const ytdl = require("ytdl-core");
// const ytpl = require("ytpl");
// const path = require("path");

// const playlistId = "PLoJv7dYW7RWQd1lt_ex0x8_6cn1WY6HlE";
// const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
// const sanitizeFilename = (filename) => {
//   return filename.replace(/[\/\?<>\\:\*\|":]/g, "").replace(/\s+/g, "_");
// };
// const downloadPlaylist = async (playlistUrl) => {
//   try {
//     const playlist = await ytpl(playlistUrl);
//     const { title } = playlist;
//     const sanitizedTitle = sanitizeFilename(title);
//     const dir = path.join(__dirname, sanitizedTitle);

//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir);
//     }

//     const { items } = playlist;
//     for (let i = 0; i < items.length; i++) {
//       const { title, id } = items[i];
//       const videoUrl = `https://www.youtube.com/watch?v=${id}`;
//       await downloadVideo(videoUrl, dir, title, i + 1, items.length);
//     }
//   } catch (error) {
//     console.error("Error downloading playlist:", error);
//   }
// };

// const downloadVideo = async (videoUrl, dir, title, current, total) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const showVideoInfo = await ytdl.getInfo(videoUrl);
//       const format =
//         showVideoInfo.formats.find((format) => format.itag === 22) ||
//         showVideoInfo.formats.find((format) => format.itag === 18);

//       if (!format) {
//         console.log(`No format found for video ${title}`);
//         return;
//       }

//       const video = ytdl(videoUrl, { quality: format.itag });
//       const writeStream = fs.createWriteStream(`${dir}/${title}.mp4`);

//       video.on("progress", (chunkLength, downloaded, total) => {
//         const percent = (downloaded / total) * 100;
//         process.stdout.clearLine();
//         process.stdout.cursorTo(0);
//         process.stdout.write(`Downloading: ${title} - ${percent.toFixed(2)}%`);
//       });

//       video.pipe(writeStream);

//       video.on("end", () => {
//         process.stdout.clearLine();
//         process.stdout.cursorTo(0);
//         console.log(`Downloaded: ${title}`);
//         resolve();
//       });

//       video.on("error", (error) => {
//         process.stdout.clearLine();
//         process.stdout.cursorTo(0);
//         console.error(`Error downloading video ${title}:`, error);
//         reject(error);
//       });
//     } catch (error) {
//       process.stdout.clearLine();
//       process.stdout.cursorTo(0);
//       console.error(`Error downloading video ${title}:`, error);
//       reject(error);
//     }
//   });
// };

// downloadPlaylist(playlistUrl);
const fs = require("fs");
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const path = require("path");
const cliProgress = require("cli-progress"); // Add this line

const playlistId = "PLApF_J7NFBhiswOE0Z3oP-FiP2svB4P7f";
const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;

const downloadPlaylist = async (playlistUrl) => {
  try {
    const playlist = await ytpl(playlistUrl);
    const { title } = playlist;
    const sanitizedTitle = title;
    const dir = path.join(__dirname, sanitizedTitle);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const { items } = playlist;
    for (let i = 0; i < items.length; i++) {
      const { title, id } = items[i];

      const videoUrl = `https://www.youtube.com/watch?v=${id}`;
      const sentizeTitle = title
        .replace(/[\/\?<>\\:\*\|":]/g, "")
        .replace(/\s+/g, "_");
      await downloadVideo(videoUrl, dir, sentizeTitle, i + 1, items.length);
    }
  } catch (error) {
    console.error("Error downloading playlist:", error);
  }
};

const downloadVideo = async (videoUrl, dir, title, current, total) => {
  return new Promise(async (resolve, reject) => {
    try {
      const showVideoInfo = await ytdl.getInfo(videoUrl);
      const format =
        showVideoInfo.formats.find((format) => format.itag === 22) ||
        showVideoInfo.formats.find((format) => format.itag === 18);

      if (!format) {
        console.log(`No format found for video ${title}`);
        return;
      }

      const video = ytdl(videoUrl, { quality: format.itag });
      const writeStream = fs.createWriteStream(`${dir}/${title}.mp4`);

      let downloaded = 0;
      let totalSize = 0;

      const progressBar = new cliProgress.SingleBar(
        {},
        cliProgress.Presets.shades_classic
      ); // Add this line
      progressBar.start(100, 0); // Add this line

      video.on("progress", (chunkLength, downloaded, total) => {
        const percent = (downloaded / total) * 100;
        progressBar.update(percent); // Add this line
      });

      video.pipe(writeStream);

      video.on("end", () => {
        progressBar.stop(); // Add this line
        //console message in green color
        console.log("\x1b[32m%s\x1b[0m", `Downloaded: ${title}`);
        // console.log(`Downloaded: ${title}`);
        resolve();
      });

      video.on("error", (error) => {
        progressBar.stop(); // Add this line
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
