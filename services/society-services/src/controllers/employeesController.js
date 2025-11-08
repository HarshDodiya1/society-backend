import BuildingEmployeesModel from '../models/BuildingEmployees.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createEmployee = async (req, res) => {
    try {
        const {
            firstName, lastName, countryCodeName, countryCode, phoneNumber, email,
            gender, address, dateOfBirth, employeeType, employmentType, agencyDetails,
            idProofType, idProofNumber, idProofDocument, policeVerificationDocument,
            shiftTimings, workingDays, joiningDate, buildingId
        } = req.body;

        if (!firstName || !lastName || !phoneNumber || !email || !employeeType || !employmentType || !buildingId) {
            return errorResponse(res, 'Required fields are missing', 400);
        }

        if (employmentType === 'agency' && !agencyDetails?.agencyName) {
            return errorResponse(res, 'Agency details are required for agency employees', 400);
        }

        const newEmployee = await BuildingEmployeesModel.create({
            firstName,
            lastName,
            countryCodeName: countryCodeName || 'IN',
            countryCode: countryCode || '+91',
            phoneNumber,
            email,
            gender,
            address,
            dateOfBirth,
            employeeType,
            employmentType,
            agencyDetails,
            idProofType,
            idProofNumber,
            idProofDocument,
            policeVerificationDocument,
            shiftTimings,
            workingDays: workingDays || [],
            joiningDate: joiningDate || new Date(),
            buildingId,
            status: 'active',
            createdBy: req.user?._id
        });

        return successResponse(res, newEmployee, 'Employee added successfully', 201);
    } catch (error) {
        console.error('Create employee error:', error);
        return errorResponse(res, error.message || 'Failed to add employee', 500);
    }
};

export const getEmployees = async (req, res) => {
    try {
        const { buildingId, employeeType, employmentType, status } = req.query;

        const filter = { isDeleted: false };
        if (buildingId) filter.buildingId = buildingId;
        if (employeeType) filter.employeeType = employeeType;
        if (employmentType) filter.employmentType = employmentType;
        if (status) filter.status = status;

        const employees = await BuildingEmployeesModel.find(filter)
            .populate('buildingId', 'buildingName societyName')
            .sort({ createdAt: -1 });

        return successResponse(res, employees, 'Employees fetched successfully');
    } catch (error) {
        console.error('Get employees error:', error);
        return errorResponse(res, error.message || 'Failed to fetch employees', 500);
    }
};

export const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await BuildingEmployeesModel.findOne({ _id: id, isDeleted: false })
            .populate('buildingId', 'buildingName societyName');

        if (!employee) {
            return errorResponse(res, 'Employee not found', 404);
        }

        return successResponse(res, employee, 'Employee fetched successfully');
    } catch (error) {
        console.error('Get employee error:', error);
        return errorResponse(res, error.message || 'Failed to fetch employee', 500);
    }
};

export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await BuildingEmployeesModel.findOne({ _id: id, isDeleted: false });
        if (!employee) {
            return errorResponse(res, 'Employee not found', 404);
        }

        const updatedEmployee = await BuildingEmployeesModel.findByIdAndUpdate(
            id,
            { ...req.body, updatedBy: req.user?._id, updatedAt: new Date() },
            { new: true }
        );

        return successResponse(res, updatedEmployee, 'Employee updated successfully');
    } catch (error) {
        console.error('Update employee error:', error);
        return errorResponse(res, error.message || 'Failed to update employee', 500);
    }
};

export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await BuildingEmployeesModel.findOne({ _id: id, isDeleted: false });
        if (!employee) {
            return errorResponse(res, 'Employee not found', 404);
        }

        await BuildingEmployeesModel.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
            updatedBy: req.user?._id
        });

        return successResponse(res, null, 'Employee removed successfully');
    } catch (error) {
        console.error('Delete employee error:', error);
        return errorResponse(res, error.message || 'Failed to remove employee', 500);
    }
};

export const updateEmployeeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['active', 'inactive'].includes(status)) {
            return errorResponse(res, 'Valid status is required', 400);
        }

        const employee = await BuildingEmployeesModel.findOne({ _id: id, isDeleted: false });
        if (!employee) {
            return errorResponse(res, 'Employee not found', 404);
        }

        const updatedEmployee = await BuildingEmployeesModel.findByIdAndUpdate(
            id,
            { status, updatedBy: req.user?._id, updatedAt: new Date() },
            { new: true }
        );

        return successResponse(res, updatedEmployee, 'Status updated successfully');
    } catch (error) {
        console.error('Update employee status error:', error);
        return errorResponse(res, error.message || 'Failed to update status', 500);
    }
};
