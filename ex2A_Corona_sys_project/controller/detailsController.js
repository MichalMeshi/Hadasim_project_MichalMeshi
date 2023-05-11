const {response} = require("express");
const con = require('../models/connect2db');
const createTablesInDatabase = require('../models/databaseTables');
const closeConnection = require('../models/databaseTables');
createTablesInDatabase();
module.exports = (function() {

    /**
     * function that add personal details to the database
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async function addPersonalDetails(req, res) {
        con.getConnection(function(err,connection) {
            if (err) throw err;
            console.log("Connected!");
            let sql = 'INSERT INTO personal_details '+ 'VALUES ('+"'"+req.query.first_name+ "'"+','+ "'"+req.query.last_name+ "'"+','+req.query.id+',' + "'"+req.query.city+ "'"+','+
                "'"+req.query.street+ "'"+','+req.query.House+',"'+req.query.date_of_birth+'",'+req.query.telephone+','+ req.query.mobile_phone+');';
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 line inserted");
                connection.release();
            });
        });
    };

    /**
     * function that get personal details from the database
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async function getPersonalDetails(req, res) {
        con.getConnection(function(err,connection) {
            if (err) throw err;
            console.log("Connected!");
            let sql = 'SELECT *, DATE_FORMAT(date_of_birth, "%Y-%m-%d") AS date_of_birth FROM personaldetails';
            con.query(sql, function (err, result, fields) {
                if (err) throw err;
                console.log(result);
                res.json(result);
                connection.release();
            });
        });
    }

    /**
     * function that add vaccine details to the database
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async function addVaccinesDetails(req, res) {
        con.getConnection(function(err,connection) {
            if (err) throw err;
            console.log("Connected!");
            // Check if ID exists in personal_details table
            let idSql = 'SELECT id FROM personal_details WHERE id = ' + req.query.id + ';';
            con.query(idSql, function(err, result) {
                if (err) throw err;
                if (result.length === 0) {
                    // If ID doesn't exist, send an error message and do not insert into vaccines_details table
                    res.status(400).send('ID does not exist in personal_details table');
                } else {
                    insertIntoVaccinesDetails(req,res,connection);
                }
            });
        });
    }

    /**
     * function that insert the vaccine details to the database
     * @param req
     * @param res
     * @param connection
     */
    function insertIntoVaccinesDetails(req,res,connection) {
        // If ID exists, check count of existing records for the same ID
        let countSql = 'SELECT COUNT(*) as count FROM vaccines_details WHERE id = ' + req.query.id + ';';
        con.query(countSql, function(err, result) {
            if (err) throw err;
            // Check if result is not empty and count is less than 4
            if (result.length > 0 && result[0].count < 4) {
                // If count is less than 4, insert the new record
                let sql = 'INSERT INTO vaccines_details ' + 'VALUES (' + req.query.id + ',' + "'" + req.query.vaccine_manufacturer + "'" + ',"' + req.query.vaccine_date + '");';
                con.query(sql, function(err, result) {
                    if (err) throw err;
                    console.log("1 line inserted");
                    connection.release();
                });
            } else {
                // If result is empty or count is 4 or more, return an error message
                res.status(400).send('Maximum number of records (4) reached for ID: ' + req.query.id);}
        });
    }

    /**
     * function that get vaccine details from the database
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async function getVaccinesDetails(req, res){
        con.getConnection(function(err, connection) {
            if (err) throw err;
            console.log("Connected!");
            let sql = 'SELECT *, DATE_FORMAT(vaccine_date, "%Y-%m-%d") AS vaccine_date FROM vaccines_details';
            con.query(sql, function (err, result, fields) {
                if (err) throw err;
                console.log(result);
                res.json(result);
                connection.release();
            });
        });
    }


    /**
     * function that add corona details of patient to the database
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async function addCoronaPatient(req, res) {
        con.getConnection(function (err,connection) {
            if (err) throw err;
            console.log("Connected!");
            // Check if the requested id exists in the personal_details table
            let checkSql = 'SELECT COUNT(*) as count FROM personal_details WHERE id = ' + req.query.id + ';';
            con.query(checkSql, function (err, result) {
                if (err) throw err;
                if (result[0].count === 0) {
                    // If ID doesn't exist, send an error message and do not insert into vaccines_details table
                    res.status(400).send('Personal details with id ' + req.query.id + ' does not exist.');
                } else {
                    insertIntoCoronaPatient(req,res,connection)
                }
            });
        });
    }

    /**
     * function that insert the corona details of patient to the database
     * @param req
     * @param res
     * @param connection
     */
    function insertIntoCoronaPatient(req,res,connection) {
        // The id exists in the personal_details table, proceed with inserting a new row in corona_patient table
        let sql = 'SELECT id FROM corona_patient WHERE id = ' + req.query.id + ';';
        con.query(sql, function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                // The id already exists in the table, so do nothing
                res.status(400).send('Id already exists');
            } else {
                // The id does not exist in the table, so insert a new row
                sql = 'INSERT INTO corona_patient VALUES (' + req.query.id + ',"' + req.query.positive_result_date + '","' + req.query.recovery_date + '");';
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 line inserted");
                    connection.release();
                });
            }
        });
    }

    /**
     * function that get all the details of patient from the 3 tables
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async function getDataOfPatient(req, res ){
        const id = req.params.id;
        const query = `SELECT * , DATE_FORMAT(positive_result_date, "%Y-%m-%d") AS positive_result_date,DATE_FORMAT(date_of_birth, "%Y-%m-%d") AS date_of_birth,
                              DATE_FORMAT(recovery_date, "%Y-%m-%d") AS recovery_date,DATE_FORMAT(vaccine_date, "%Y-%m-%d") AS vaccine_date
                 FROM personal_details
                 LEFT JOIN corona_patient ON personal_details.id = corona_patient.id
                 LEFT JOIN vaccines_details ON personal_details.id = vaccines_details.id
                 WHERE personal_details.id = ?`;

        con.query(query, [id], (error, results, fields) => {
            if (error) throw error;

            if (results.length > 0) {
                res.send(results);
            } else {
                res.send('No data found for the given ID.');
            }
        });
    }

    /**
     * function that get corona details of patient from the database
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async function getCoronaPatient(req, res) {
        con.getConnection(function(err,connection) {
            if (err) throw err;
            console.log("Connected!");
            let sql = 'SELECT *, DATE_FORMAT(positive_result_date, "%Y-%m-%d") AS positive_result_date,DATE_FORMAT(recovery_date, "%Y-%m-%d") AS recovery_date FROM corona_patient';
            con.query(sql, function (err, result, fields) {
                if (err) throw err;
                console.log(result);
                res.json(result);
                connection.release();
            });
        });
    }

    /**
     * function that get the num of the active patients in last month from the database
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async function getActivePatient(req, res) {
        con.getConnection(function(err, connection) {
            if (err) throw err;
            console.log("Connected!");
            let sql = `SELECT COUNT(*) AS active_patients
                   FROM corona_patient
                   WHERE positive_result_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW();`;
            con.query(sql, function (err, result, fields) {
                if (err) throw err;
                console.log(result);
                res.json(result[0].active_patients+" patient in the last month");
                connection.release();
            });
        });
    }

    /**
     * function that get the num of the members patients that unvaccinated from the database
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async function getMembersNotVaccinated(req, res) {
        con.getConnection(function(err, connection) {
            if (err) throw err;
            console.log("Connected!");
            const query = `
                SELECT COUNT(*) AS unvaccinated_count
                FROM personal_details pd
                WHERE pd.id NOT IN (
                    SELECT DISTINCT id FROM vaccines_details
                )
            `;
            con.query(query, function (err, result, fields) {
                if (err) throw err;
                console.log(result);
                res.json(result[0].unvaccinated_count+" members not vaccinated");
                connection.release();
            });
        });
    }



    return {
        addPersonalDetails: addPersonalDetails,
        getPersonalDetails: getPersonalDetails,
        addVaccinesDetails: addVaccinesDetails,
        getVaccinesDetails: getVaccinesDetails,
        addCoronaPatient: addCoronaPatient,
        getCoronaPatient: getCoronaPatient,
        getDataOfPatient: getDataOfPatient,
        getActivePatient: getActivePatient,
        getMembersNotVaccinated: getMembersNotVaccinated
    };
})();

