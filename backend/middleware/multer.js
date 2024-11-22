// import multer from "multer";
// import path from "path";

// // Set up storage and file filtering
// const storage = multer.diskStorage({
//   destination: (req, res, cb) => {
//     cb(null, "uploads/images");
//   },
//   filename: (req, res, cb) => {
//     cb(null, Date.now() + path.extname(file.orginalname));
//   },
// });

// // File validation (only accept PNG and JPEG)
// // const fileFilter = (req, file, cb) => {
// //   const filetypes = /jpeg|png|jpg/;
// //   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
// //   const mimetype = filetypes.test(file.mimetype);

// //   if (mimetype && extname) {
// //     return cb(null, true);
// //   } else {
// //     cb(new Error("Only .png .jpg and .jpeg files are allowed!"));
// //   }
// // };
// const fileFilter = (req, file, cb) => {
//   const filetypes = /jpeg|png|jpg/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb(new Error("Only .png, .jpg, and .jpeg files are allowed!"));
//   }
// };
// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only .jpg, .jpeg, and .png files are supported"));
//     }
//   },
// });

// export default upload;
import multer from "multer";

// Set up storage and file filtering
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images"); // Make sure this path exists
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname.replace(/\s+/g, "_"); // Replace spaces with underscores
    cb(null, Date.now() + "_" + originalName); // Fixed typo and added file parameter
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, and .png files are supported"));
    }
  },
});

export default upload;
