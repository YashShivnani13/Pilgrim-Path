import fs from 'fs';
import https from 'https';

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, function(response) {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        response.pipe(file);
        file.on('finish', function() {
          file.close(resolve); 
        });
      } else {
        reject(new Error(`Failed with status code: ${response.statusCode}`));
      }
    }).on('error', function(err) {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  try {
    await download('https://storage.googleapis.com/aistudio-dev-attachments/applets/3504279f-1e51-4697-9fd8-bc42c0a54942/pp.png', 'public/logo.png');
    await download('https://storage.googleapis.com/aistudio-dev-attachments/applets/3504279f-1e51-4697-9fd8-bc42c0a54942/pp2.png', 'public/favicon.png');
    await download('https://storage.googleapis.com/aistudio-dev-attachments/applets/3504279f-1e51-4697-9fd8-bc42c0a54942/Yash%20img.jpeg', 'public/yash.jpeg');
    console.log('Images downloaded successfully');
  } catch (error) {
    console.error('Download failed', error);
  }
}

main();
