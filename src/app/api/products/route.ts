import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const products = await db.collection("products").find({}).toArray();
    
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    return NextResponse.json({ error: "Failed to get products" }, { status: 500 });
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Add timestamps
    const now = new Date().toISOString();
    const productData = {
      ...body,
      created_at: now,
      updated_at: now
    };
    
    // If there's a supplierId, convert to ObjectId
    if (productData.supplierId) {
      productData.supplierId = new ObjectId(productData.supplierId);
    }
    
    const { db } = await connectToDatabase();
    
    // Check if code is unique
    const existingProduct = await db.collection("products").findOne({ code: productData.code });
    if (existingProduct) {
      return NextResponse.json({ error: "Product code must be unique" }, { status: 409 });
    }
    
    const result = await db.collection("products").insertOne(productData);
    
    // Return created product with ID
    const newProduct = {
      ...productData,
      id: result.insertedId.toString(),
      // Convert supplierId back to string for response
      supplierId: productData.supplierId ? productData.supplierId.toString() : null
    };
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
} 