import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGODB_DB || "visiondesk";

async function connectDB() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  return { db, client };
}

export async function POST(request) {
  try {
    const { name, email, department, password, confirmPassword } = await request.json();
    const { db, client } = await connectDB();
    const result = await db.collection("employees").insertOne({ name, email, department, password, confirmPassword });
    client.close();
    return new Response(JSON.stringify({ success: true, id: result.insertedId }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function GET() {
  try {
    const { db, client } = await connectDB();
    const employees = await db.collection("employees").find().toArray();
    client.close();
    return new Response(JSON.stringify({ success: true, employees }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
