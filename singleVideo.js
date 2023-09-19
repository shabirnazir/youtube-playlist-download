const fs = require("fs");
const ytdl = require("ytdl-core");

const downloadVideo = async (videoUrl, dir = "download") => {
  return new Promise(async (resolve, reject) => {
    try {
      const showVideoInfo = await ytdl.getInfo(videoUrl);
      const videoTitle = showVideoInfo.videoDetails.title;

      // Find the format with itag 137 (which corresponds to 1080p)
      const format = showVideoInfo.formats.find(
        (format) => format.itag === 137
      );
      // Find the format with itag 22 (which corresponds to 720p)
      //    const format = showVideoInfo.formats.find((format) => format.itag === 22);

      if (!format) {
        throw new Error("No format found for 1080p quality");
      }

      const video = ytdl(videoUrl, { quality: format.itag });
      const writeStream = fs.createWriteStream(`${dir}/${videoTitle}.mp4`);

      video.pipe(writeStream);

      video.on("end", () => {
        console.log(`Downloaded: ${videoTitle}`);
        resolve();
      });

      video.on("error", (error) => {
        console.error(`Error downloading video ${videoTitle}:`, error);
        reject(error);
      });
    } catch (error) {
      console.error(`Error downloading video ${videoTitle}:`, error);
      reject(error);
    }
  });
};
// change videoUrl to the video you want to download
const videoUrl = "https://www.youtube.com/watch?v=UbMgcdmYC70";
downloadVideo(videoUrl);
