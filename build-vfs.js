const fs = require("fs");

const font = fs.readFileSync("./fonts/Amiri-Regular.ttf").toString("base64");

const vfs = {
    "Amiri-Regular.ttf": font
};

fs.writeFileSync(
    "./public/vfs_fonts.js",
    "pdfMake.vfs = " + JSON.stringify(vfs)
);

console.log("VFS created successfully");