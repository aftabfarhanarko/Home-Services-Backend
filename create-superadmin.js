const { Client } = require('pg');
const bcrypt = require('bcrypt');

const dbUrl = 'postgresql://neondb_owner:npg_nvPhcRFD2Gd0@ep-calm-math-ay3nlp28-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function seedSuperAdmin() {
  const client = new Client({ connectionString: dbUrl });
  try {
    await client.connect();
    console.log('Connected to Neon DB');

    // 1. Ensure 'Super Admin' role exists
    let resRole = await client.query("SELECT * FROM roles WHERE name = 'Super Admin' LIMIT 1;");
    let roleId;

    if (resRole.rows.length === 0) {
      const insertRole = await client.query(
        "INSERT INTO roles (name, permissions, \"createdAt\", \"updatedAt\") VALUES ('Super Admin', '{}', NOW(), NOW()) RETURNING id;"
      );
      roleId = insertRole.rows[0].id;
      console.log('Created Super Admin role with ID:', roleId);
    } else {
      roleId = resRole.rows[0].id;
      console.log('Found Super Admin role with ID:', roleId);
    }

    // 2. Hash password
    const email = 'admin@rajseba.com';
    const password = 'adminpassword123';
    const hashedPassword = await bcrypt.hash(password, 10);
    const phone = '01700000000';
    const name = 'Super Admin';

    // 3. Upsert Super Admin user
    let resUser = await client.query("SELECT * FROM users WHERE email = $1 OR phone = $2 LIMIT 1;", [email, phone]);
    if (resUser.rows.length > 0) {
      await client.query(
        "UPDATE users SET name = $1, email = $2, password = $3, \"roleId\" = $4, status = 'active' WHERE id = $5;",
        [name, email, hashedPassword, roleId, resUser.rows[0].id]
      );
      console.log('Updated existing Super Admin user!');
    } else {
      await client.query(
        "INSERT INTO users (name, phone, email, password, \"roleId\", status, \"wallet_balance\", \"commission_percentage\", \"isPhoneVerified\", \"createdAt\", \"updatedAt\") VALUES ($1, $2, $3, $4, $5, 'active', 0, 0, true, NOW(), NOW());",
        [name, phone, email, hashedPassword, roleId]
      );
      console.log('Created new Super Admin user!');
    }

    console.log('\n=======================================');
    console.log('SUCCESS! Super Admin Created');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('=======================================\n');
  } catch (err) {
    console.error('Error seeding Super Admin:', err);
  } finally {
    await client.end();
  }
}

seedSuperAdmin();
