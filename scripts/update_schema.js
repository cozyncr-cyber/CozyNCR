// update_schema.js
const sdk = require("node-appwrite");

// HARDCODE THESE FOR THE SCRIPT OR USE DOTENV
const client = new sdk.Client()
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"
  )
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

const databases = new sdk.Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_LISTING_COLLECTION_ID;

async function updateSchema() {
  console.log("Updating Schema...");

  try {
    // 1. Add Children Count
    await databases.createIntegerAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      "maxChildren",
      false,
      0,
      0
    );
    console.log("Added maxChildren attribute");
  } catch (e) {
    console.log("maxChildren likely exists");
  }

  try {
    // 2. Add Infants Count
    await databases.createIntegerAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      "maxInfants",
      false,
      0,
      0
    );
    console.log("Added maxInfants attribute");
  } catch (e) {
    console.log("maxInfants likely exists");
  }

  try {
    // 3. Add Pets Count
    await databases.createIntegerAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      "maxPets",
      false,
      0,
      0
    );
    console.log("Added maxPets attribute");
  } catch (e) {
    console.log("maxPets likely exists");
  }

  console.log("Schema Update Complete.");
}

updateSchema();
