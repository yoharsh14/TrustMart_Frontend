import pinataSDK from "@pinata/sdk";
import fs from "fs";
import path from "path";
import React from "react";
const PINATA_API_KEY = "eb924dcb79a3fa5fa8c7";
const PINATA_API_SECRET =
  "c9a11cbc5aabda11e22fbed353c27a307ada7cc69d37a6a4c2eab0fc85779840";
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret);

export default function Pinnata() {
  const storeImages = async (imagesFilePath) => {
    const fullImagesPath = path.resolve(imagesFilePath);

    // Filter the files in case the are a file that in not a .png
    const files = fs.readdirSync(fullImagesPath);

    let responses = [];
    console.log("Uploading to IPFS");

    for (const fileIndex in files) {
      const readableStreamForFile = fs.createReadStream(
        `${fullImagesPath}/${files[fileIndex]}`
      );
      const options = {
        pinataMetadata: {
          name: files[fileIndex],
        },
      };
      try {
        await pinata
          .pinFileToIPFS(readableStreamForFile, options)
          .then((result) => {
            responses.push(result);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    }
    return { responses, files };
  };

  const storeTokenUriMetadata = async (metadata) => {
    const options = {
      pinataMetadata: {
        name: metadata.name,
      },
    };
    try {
      const response = await pinata.pinJSONToIPFS(metadata, options);
      return response;
    } catch (error) {
      console.log(error);
    }
    return null;
  };
  const main = async () => {
    const { responses, files } = await storeImages("../backend/images/");
    console.log(responses);
    console.log(files);
    const key = {
      name: "aCustomNameForYourUpload",
      keyvalues: {
        customKey: "customValue",
        customKey2: "customValue2",
      },
    };
    //   const response = await storeTokenUriMetadata(key);
    //   console.log(response);
  };

  return <div></div>;
}
