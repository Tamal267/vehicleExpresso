const express=require('express');
const router = express.Router();
const {pieData, lineData, serviceUser,}=require("../controllers/careController");


router.post('/piedata',pieData);
router.post('/linedata',lineData);
router.post('/user',serviceUser);

module.exports = router;