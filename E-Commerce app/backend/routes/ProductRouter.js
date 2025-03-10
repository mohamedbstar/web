import express from "express";
import ProductController from "../controllers/ProductController.js";
import HttpStatus from "../utils/HttpStatus.js";
import multer from "multer"
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

//File Upload Settings
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('FILE in diskStorage==> ', file);
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const fileName = 'post-'+req.currentUserEmail + Date.now() + '.' + ext;
        req.images = (req.images || []);
        req.images.push(fileName)
        console.log("from diskStorage: " + req.images);  
        
        cb(null, fileName);
    }
})


const upload = multer({ storage: diskStorage});

const ProductRouter = express.Router();

const dummy_res = async(req, res, next)=>{
    res.status(200).json({status : HttpStatus.SUCCESS, message : "Dummy Response", data : null});
}

ProductRouter.route("/")
    .get(ProductController.getAllProducts)//get all products
    .post(verifyToken,verifyAdmin,upload.array('images',6), ProductController.addProduct) //add product, max of 6 images 
    
ProductRouter.route("/categories/:category")
    .get(ProductController.getProductsByCategory) //get all products by category 

ProductRouter.route("/:id")
    .get(ProductController.getProduct) //get product by id
    .put(verifyToken, verifyAdmin, upload.array('images', 6), ProductController.editProduct)//edit product
    .delete(verifyToken, verifyAdmin, ProductController.deleteProduct)//delete product




export default ProductRouter;