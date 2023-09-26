import { v4 as uuidv4 } from "uuid";
import path from "node:path";
import { unlinkSync, createWriteStream } from "node:fs";

export const storeFile = ({
  filename,
  mimetype,
  encoding,
  createReadStream,
}: any) => {
  const extension = filename.split(".").pop();
  const encryptedName = `${uuidv4()}-${Date.now()}.${extension}`;
  const filePath = `../../images/${encryptedName}`;
  const fullPath = path.resolve(`${__dirname}/${filePath}`);

  const PORT = parseInt(process.env.PORT || "", 10);
  const HOST = process.env.HOST as string;

  const stream = createReadStream();

  return new Promise((resolve, reject) => {
    stream
      .on("error", (error: any) => {
        if (stream.truncated) unlinkSync(fullPath);
        reject(error);
      })
      .pipe(createWriteStream(fullPath))
      .on("error", (error: any) => reject(error))
      .on("finish", () =>
        resolve({
          extension,
          filename: encryptedName,
          mimetype,
          encoding,
          filePath,
          fullPath,
          dbPath: `http://${HOST}:${PORT}/${encryptedName}`,
        })
      );
  });
};

export const deleteFile = (fileName: string) => {
  try {
    unlinkSync(`${__dirname}/../../images/${fileName}`);
  } catch (error) {}
};
