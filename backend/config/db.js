import pg from 'pg'
const Pool = pg.Pool;

const pool = new Pool({
    user:"postgres",
    password:"1234",
    host:"localhost",
    port: 5432,
    database: "contactkeeperapp"
})

export default pool;