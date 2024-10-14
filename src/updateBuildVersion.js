const fs = require("fs");

const buildData = {
  buildVersion: new Date().getTime(),
};

const jdonBuildData = JSON.stringify(buildData);

fs.writeFile("./public/meta.json", jdonBuildData, "utf8", (error) => {
  if (error) {
    console.log("An error occured while saving new build version in meta.json");
    return console.log(error);
  }

  console.log("Latest build version updated in meta.json file");
});
