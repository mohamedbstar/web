import express from "express"
import cors from "cors"
import "dotenv/config"
import HttpStatus from "./utils/HttpStatus.js"
import UserRouter from "./routes/UserRouter.js";
import ProductRouter from "./routes/ProductRouter.js";
import OrderRouter from "./routes/OrderRouter.js";

const app = express();

async function getCategories(req, res, next) {
    const cats  = ['airpod', 'camera', 'earphone', 'mobile', 'mouse', 'printer', 'processor', 'refrigerator',
        'speaker', 'trimmer', 'tv', 'watch'
    ]

    res.status(200).json({status : "success", message : 'all categories', data : cats});

}


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));

app.use("/api/users", UserRouter);
app.use("/api/products", ProductRouter);
app.use("/api/orders", OrderRouter);
app.get("/categories", getCategories)


app.all('*', (req, res, next)=>{
    res.status(404).json({status : HttpStatus.FAIL,message : "Resource Doesn't Exist", code : 404 });
})

app.use((error, req, res, next)=>{
    res.status(error.statusCode || 500).json({status : error.statusText, message : error.message, code : error.statusCode || 500});
})

app.listen(5000, ()=>{  
    console.log('App is listening on port 5000');
})