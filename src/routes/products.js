// ************ Require's ************
const express = require('express');
const router = express.Router();

/* Multer */
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        
       callback(null , "public/images/products");
    },
       filename : (req, file, callback) => {
        callback(null, `${Date.now}_products_${path.extname(file.originalname)}`);
       
    },
})

const uploadImageProduct = multer({storage});


// ************ Controller Require ************
const productsController = require('../controllers/productsController');

/*** GET ALL PRODUCTS ***/ 
router.get('/', productsController.index); 

/*** CREATE ONE PRODUCT ***/ 
router.get('/create/', productsController.create); 
router.post('/create', uploadImageProduct.single("image"), productsController.store); 


/*** GET ONE PRODUCT ***/ 
router.get('/detail/:id/', productsController.detail); 

/*** EDIT ONE PRODUCT ***/ 
router.get('/edit/:id', productsController.edit); 
router.put('/edit/:id', uploadImageProduct.single("image"),productsController.update); 


/*** DELETE ONE PRODUCT***/ 
router.delete('/deleted/:id', productsController.destroy); 


module.exports = router;
