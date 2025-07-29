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
    const { email, password } = await request.json();
    const { db, client } = await connectDB();
    const user = await db.collection("employees").findOne({ email, password });
    client.close();
    if (user) {
      return new Response(JSON.stringify({ success: true, user: { name: user.name, email: user.email } }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ success: false, error: "Invalid credentials" }), { status: 401 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
