import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGODB_DB || "visiondesk";

async function getCollection() {
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set.");
  }
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  return { collection: db.collection("contracts"), client };
}

export async function GET(req) {
  let client;
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const result = await getCollection();
    client = result.client;
    const collection = result.collection;
    let query = {};
    if (type) query.type = type;
    const contracts = await collection.find(query).toArray();
    return Response.json({ success: true, contracts });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}

export async function POST(req) {
  let client;
  try {
    const result = await getCollection();
    client = result.client;
    const collection = result.collection;
    const body = await req.json();
    // Ensure contract type is unique (no duplicate type+vendor)
    const exists = await collection.findOne({ type: body.type, vendor: body.vendor });
    if (exists) {
      return Response.json({ success: false, error: "Contract for this type and vendor already exists." }, { status: 400 });
    }
    const resultInsert = await collection.insertOne(body);
    return Response.json({ success: true, contract: { ...body, _id: resultInsert.insertedId } });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}
