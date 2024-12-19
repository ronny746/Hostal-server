const express = require('express');
const { createHostel, getHostels, updateHostel, deleteHostel, searchHostels } = require('../controllers/hostel.controller');
const router = express.Router();

router.post('/', createHostel);
router.get('/', getHostels);
router.put('/:id', updateHostel);
router.delete('/:id', deleteHostel);

router.get('/search', searchHostels);



module.exports = router;
