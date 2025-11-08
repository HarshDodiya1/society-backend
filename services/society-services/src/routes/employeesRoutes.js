import express from 'express';
import {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    updateEmployeeStatus
} from '../controllers/employeesController.js';

const router = express.Router();

router.post('/', createEmployee);
router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.put('/:id/status', updateEmployeeStatus);
router.delete('/:id', deleteEmployee);

export default router;
