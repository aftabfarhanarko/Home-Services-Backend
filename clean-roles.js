const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_QiGF6EYVO8Ba@ep-round-rain-adnr018b-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
});

async function run() {
  await client.connect();
  console.log("Connected to Neon DB.");
  
  try {
    await client.query('TRUNCATE TABLE "roles" CASCADE;');
    console.log("Truncated 'roles' table successfully.");
  } catch (err) {
    console.error("Error truncating roles:", err.message);
  } finally {
    await client.end();
  }
}

run();
