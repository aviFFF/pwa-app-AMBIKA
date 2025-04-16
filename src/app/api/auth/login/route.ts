import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // In a real application, you would validate these credentials against your database
    // This is just an example implementation
    if (email === "admin@example.com" && password === "password123") {
      // Create a sample JWT token (in a real app, use a proper JWT library)
      const token = "sample-jwt-token-" + Date.now();
      
      // Create response with token
      const response = NextResponse.json(
        { 
          success: true,
          user: {
            id: "1",
            email: "admin@example.com",
            name: "Admin User"
          },
          token
        },
        { status: 200 }
      );
      
      // Set token in response header (can be used as Bearer token)
      response.headers.set('Authorization', `Bearer ${token}`);
      
      return response;
    } else {
      // Invalid credentials
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
} 