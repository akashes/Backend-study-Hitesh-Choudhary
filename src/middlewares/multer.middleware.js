
import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      cb(null, './public/temp'); // Ensure this path exists
      
    } catch (error) {
      console.log('Error in file destination',error)
      cb(error)
    }
  },


  filename: function (req, file, cb) {
    try {
      const ext = path.extname(file.originalname);
      // cb(null, file.originalname + '-' + Date.now() + ext);
       cb(null, file.originalname );
      
    } catch (error) {
      console.log('Error in setting filename',error)
      cb(error)
      
    }
  }
});

const upload = multer({ storage: storage });
 
export default upload