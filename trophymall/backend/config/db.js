import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "srv1329.hstgr.io",   // ✅ correct
  user: "u934728075_TrophyMall",
  password: "TrophyMall@123",
  database: "u934728075_trophyMall",
  waitForConnections: true,
  connectionLimit: 10
});

export default db.promise();