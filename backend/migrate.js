const fs = require("fs");
const mysql = require("mysql2/promise");

async function migrate() {
  try {
    const connection = await mysql.createConnection({
      host: "mysql-11b69072-kamblevijaysinh09-46f7.f.aivencloud.com",
      port: 22205,
      user: "avnadmin",
      password: "AVNS_3owGGx4ZViPiTsZwCow",
      database: "defaultdb",
      ssl: { rejectUnauthorized: false },
      multipleStatements: true,
    });

    console.log("Connected to Aiven DB.");

    const sql = fs.readFileSync("dump.sql", "utf8");
    console.log("Executing SQL dump...");

    await connection.query(sql);

    console.log("Migration successful!");
    await connection.end();
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

migrate();
