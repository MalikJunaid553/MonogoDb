import express from "express";
import cors from "cors";
import mongoose from "mongoose"
import Product from "./model/Product.js"; 
import dotenv from "dotenv"

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Databse connected!")
    }
    catch (error){
        console.log("MongoDB Connecetion Error:" , error )
    }
}

connectDB();

app.get("/products" , async( req , res)=>{
    try{
        const products = await Product.find()
        res.json(products)
    }catch(error){
        res.status(500).json({message : "Error fetching Products"})
    }
})

app.post("/products" , async(req,res)=>{
    try{
        const newProductFields = req.body;
        const newProduct = new Product(newProductFields)
        await newProduct.save();
        res.status(201).json(newProduct) 
    }
    catch(error){
        res.status(500).json({message: "Error Creating Product"})
    }
})

app.put("/products/:id", async (req, res)=>{
    try{
        const {id} = req.params;
        const updatedProductField = req.body;
        const updatedProduct = await Product.findOneAndUpdate({id} , updatedProductField , {new: true},);
        res.json(updatedProduct)
    }catch(error){
        res.status(500).json({message: "Error updating product"})
    }
})
app.delete("/products/:id" , async(req,res)=>{
    try{
        const {id} = req.params
        await Product.findOneAndDelete({id});
        res.status(204).send();
    }catch(error){
        res.status(404).json({message: "item not found"})
    }
})
app.listen(3000, ()=>{
    console.log("Server is running at Port 3000")
})