import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET /api/orders - Get all orders
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    
    // Get orders with vendor and user information
    const pipeline = [
      {
        $lookup: {
          from: "vendors",
          localField: "vendor_id",
          foreignField: "_id",
          as: "vendor"
        }
      },
      {
        $unwind: {
          path: "$vendor",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true
        }
      }
    ];
    
    const orders = await db.collection("orders").aggregate(pipeline).toArray();
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error getting orders:", error);
    return NextResponse.json({ error: "Failed to get orders" }, { status: 500 });
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_number, date, vendor_id, items, total, status, created_by } = body;
    
    // Basic validation
    if (!order_number || !date || !vendor_id || !items || !total || !status || !created_by) {
      return NextResponse.json(
        { error: "Missing required fields for order creation" },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Begin transaction
    const session = db.client.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Check if order number already exists
        const existingOrder = await db.collection("orders").findOne({ order_number });
        if (existingOrder) {
          throw new Error("Order number already exists");
        }
        
        // Convert IDs to ObjectIds
        const vendorObjectId = new ObjectId(vendor_id);
        const createdByObjectId = new ObjectId(created_by);
        
        // Create order document
        const now = new Date().toISOString();
        const orderData = {
          order_number,
          date,
          vendor_id: vendorObjectId,
          total,
          status,
          payment_status: body.payment_status || "pending",
          payment_method: body.payment_method || null,
          created_by: createdByObjectId,
          created_at: now,
          updated_at: now
        };
        
        // Insert order
        const orderResult = await db.collection("orders").insertOne(orderData, { session });
        const orderId = orderResult.insertedId;
        
        // Process order items
        const orderItems = items.map(item => ({
          order_id: orderId,
          product_id: new ObjectId(item.product_id),
          quantity: item.quantity,
          price: item.price,
          total: item.total
        }));
        
        // Insert order items
        await db.collection("order_items").insertMany(orderItems, { session });
        
        // Update inventory for each item
        for (const item of items) {
          const productId = new ObjectId(item.product_id);
          
          // Get current inventory
          const inventoryItem = await db.collection("inventory").findOne({ product_id: productId }, { session });
          
          if (inventoryItem) {
            // Update existing inventory
            await db.collection("inventory").updateOne(
              { product_id: productId },
              { 
                $inc: { quantity: -item.quantity },
                $set: { last_updated: now }
              },
              { session }
            );
          } else {
            // Create new inventory entry with negative quantity
            await db.collection("inventory").insertOne({
              product_id: productId,
              quantity: -item.quantity,
              last_updated: now
            }, { session });
          }
        }
      });
      
      // Get created order with items
      const pipeline = [
        {
          $match: { order_number }
        },
        {
          $lookup: {
            from: "order_items",
            localField: "_id",
            foreignField: "order_id",
            as: "items"
          }
        },
        {
          $lookup: {
            from: "vendors",
            localField: "vendor_id",
            foreignField: "_id",
            as: "vendor"
          }
        },
        {
          $unwind: {
            path: "$vendor",
            preserveNullAndEmptyArrays: true
          }
        }
      ];
      
      const [createdOrder] = await db.collection("orders").aggregate(pipeline).toArray();
      
      return NextResponse.json(createdOrder, { status: 201 });
    } catch (error) {
      console.error("Transaction error:", error);
      throw error;
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error("Error creating order:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 