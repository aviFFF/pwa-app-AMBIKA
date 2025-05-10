import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET /api/inventory - Get all inventory items
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    
    // Get inventory items with product information
    const pipeline = [
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $unwind: {
          path: "$product",
          preserveNullAndEmptyArrays: true
        }
      }
    ];
    
    const inventory = await db.collection("inventory").aggregate(pipeline).toArray();
    
    return NextResponse.json(inventory);
  } catch (error) {
    console.error("Error getting inventory:", error);
    return NextResponse.json({ error: "Failed to get inventory" }, { status: 500 });
  }
}

// POST /api/inventory - Update inventory
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, quantity, location } = body;
    
    if (!product_id || quantity == null) {
      return NextResponse.json(
        { error: "Product ID and quantity are required" },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Check if product exists
    const productObjectId = new ObjectId(product_id);
    const product = await db.collection("products").findOne({ _id: productObjectId });
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    // Check if inventory item exists
    const inventoryItem = await db.collection("inventory").findOne({ 
      product_id: productObjectId 
    });
    
    let result;
    
    if (inventoryItem) {
      // Update existing inventory item
      result = await db.collection("inventory").updateOne(
        { product_id: productObjectId },
        { 
          $set: { 
            quantity: quantity,
            location: location || inventoryItem.location,
            last_updated: new Date().toISOString()
          } 
        }
      );
    } else {
      // Create new inventory item
      result = await db.collection("inventory").insertOne({
        product_id: productObjectId,
        quantity: quantity,
        location: location || null,
        last_updated: new Date().toISOString()
      });
    }
    
    // Get updated inventory item
    const updatedItem = await db.collection("inventory").findOne({ 
      product_id: productObjectId 
    });
    
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating inventory:", error);
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 });
  }
} 