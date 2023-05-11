const express = require('express');
const router = express.Router();
const detailsController = require('../controller/detailsController');


router.post('/personalDetailsAdd', detailsController.addPersonalDetails);
router.get('/personalDetailsAdd', detailsController.getPersonalDetails);

router.post('/vaccineDetailsAdd', detailsController.addVaccinesDetails);
router.get('/vaccineDetailsGet', detailsController.getVaccinesDetails);

router.post('/coronaPatientAdd', detailsController.addCoronaPatient);
router.get('/coronaPatientGet', detailsController.getCoronaPatient);


router.get('/data/:id', detailsController.getDataOfPatient);

router.get('/activePatient', detailsController.getActivePatient);

router.get('/membersNotVaccinated', detailsController.getMembersNotVaccinated);


module.exports = router;

