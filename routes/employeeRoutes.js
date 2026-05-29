const express = require('express');
const { getEmployees, getEmployee, addEmployee, editEmployee, removeEmployee } = require('../controllers/employeeController');
const upload = require('../middleware/upload');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes - anyone can view
router.get('/', getEmployees);
router.get('/:id', getEmployee);

// Admin only routes
router.post('/', verifyToken, isAdmin, upload.single('photo'), addEmployee);
router.put('/:id', verifyToken, isAdmin, upload.single('photo'), editEmployee);
router.delete('/:id', verifyToken, isAdmin, removeEmployee);

module.exports = router;
