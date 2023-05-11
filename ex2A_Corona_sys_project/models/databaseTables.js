var pool = require('./connect2db');

const createTablesInDatabase = async function() {
    // Create the personal_details table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS personal_details (
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            id INT(11) NOT NULL,
            city VARCHAR(255) NOT NULL,
            street VARCHAR(255) NOT NULL,
            House VARCHAR(255) NOT NULL,
            date_of_birth DATE NOT NULL,
            telephone VARCHAR(255) NOT NULL,
            mobile_phone VARCHAR(255) NOT NULL,
            PRIMARY KEY(id)
            )`);

    // Create the vaccines_details table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS vaccines_details (
            id INT(11) NOT NULL,
            vaccine_manufacturer VARCHAR(255) NOT NULL,
            vaccine_date DATE NOT NULL,
            FOREIGN KEY(id) REFERENCES personal_details(id)
            )`);

    // Create the corona_patient table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS corona_patient (
            id INT(11) NOT NULL,
            positive_result_date DATE NOT NULL,
            recovery_date DATE NOT NULL,
            FOREIGN KEY(id) REFERENCES personal_details(id)
            )`);

}
module.exports = createTablesInDatabase;
