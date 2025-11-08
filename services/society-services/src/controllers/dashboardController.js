import mongoose from 'mongoose';
import BlocksModel from '../models/Blocks.js';
import UnitsModel from '../models/Units.js';
import MembersModel from '../models/Members.js';
import BuildingEmployeesModel from '../models/BuildingEmployees.js';
import ComplaintsModel from '../models/Complaints.js';
import ParkingSpotsModel from '../models/ParkingSpots.js';
import MaintenanceBillsModel from '../models/MaintenanceBills.js';
import AmenitiesModel from '../models/Amenities.js';
import EventsModel from '../models/Events.js';
import VisitorsModel from '../models/Visitors.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getDashboardStats = async (req, res) => {
    try {
        const { buildingId } = req.query;

        if (!buildingId) {
            return errorResponse(res, 'Building ID is required', 400);
        }

        const buildingObjectId = new mongoose.Types.ObjectId(buildingId);

        // Get total counts
        const totalBlocks = await BlocksModel.countDocuments({ buildingId: buildingObjectId, isDeleted: false });
        const totalUnits = await UnitsModel.countDocuments({ buildingId: buildingObjectId, isDeleted: false });

        // Units by status
        const unitStats = await UnitsModel.aggregate([
            { $match: { buildingId: buildingObjectId, isDeleted: false } },
            { $group: { _id: '$unitStatus', count: { $sum: 1 } } }
        ]);

        // Members count
        const totalOwners = await MembersModel.countDocuments({
            buildingId: buildingObjectId,
            memberType: 'owner',
            isDeleted: false
        });

        const totalTenants = await MembersModel.countDocuments({
            buildingId: buildingObjectId,
            memberType: 'tenant',
            isDeleted: false
        });

        // Employees count
        const totalEmployees = await BuildingEmployeesModel.countDocuments({
            buildingId: buildingObjectId,
            isDeleted: false,
            status: 'active'
        });

        // Complaints stats
        const complaintStats = await ComplaintsModel.aggregate([
            { $match: { buildingId: buildingObjectId, isDeleted: false } },
            { $group: { _id: '$complaintStatus', count: { $sum: 1 } } }
        ]);

        // Parking stats
        const parkingStats = await ParkingSpotsModel.aggregate([
            {
                $lookup: {
                    from: 'parkingareas',
                    localField: 'parkingAreaId',
                    foreignField: '_id',
                    as: 'parkingArea'
                }
            },
            { $unwind: '$parkingArea' },
            { $match: { 'parkingArea.buildingId': buildingObjectId, isDeleted: false } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Bills stats
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const billStats = await MaintenanceBillsModel.aggregate([
            { $match: { buildingId: buildingObjectId, month: currentMonth, year: currentYear } },
            { $group: { _id: '$billStatus', count: { $sum: 1 } } }
        ]);

        // Amenities count
        const totalAmenities = await AmenitiesModel.countDocuments({
            buildingId: buildingObjectId,
            isDeleted: false
        });

        // Events count (upcoming)
        const upcomingEvents = await EventsModel.countDocuments({
            buildingId: buildingObjectId,
            isDeleted: false,
            eventDate: { $gte: new Date() },
            eventStatus: { $in: ['published', 'ongoing'] }
        });

        // Visitors today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayVisitors = await VisitorsModel.countDocuments({
            buildingId: buildingObjectId,
            checkInTime: { $gte: today, $lt: tomorrow },
            isDeleted: false
        });

        const dashboardData = {
            totalBlocks,
            totalUnits,
            unitStats: {
                vacant: unitStats.find(s => s._id === 'Vacant')?.count || 0,
                occupied: unitStats.find(s => s._id === 'Occupied')?.count || 0,
                maintenance: unitStats.find(s => s._id === 'Under Maintenance')?.count || 0
            },
            totalOwners,
            totalTenants,
            totalEmployees,
            complaintStats: {
                open: complaintStats.find(s => s._id === 'open')?.count || 0,
                inProcess: complaintStats.find(s => s._id === 'in-process')?.count || 0,
                onHold: complaintStats.find(s => s._id === 'on-hold')?.count || 0,
                close: complaintStats.find(s => s._id === 'close')?.count || 0
            },
            parkingStats: {
                available: parkingStats.find(s => s._id === 'available')?.count || 0,
                occupied: parkingStats.find(s => s._id === 'occupied')?.count || 0,
                maintenance: parkingStats.find(s => s._id === 'maintenance')?.count || 0
            },
            billStats: {
                paid: billStats.find(s => s._id === 'paid')?.count || 0,
                due: billStats.find(s => s._id === 'due')?.count || 0,
                draft: billStats.find(s => s._id === 'draft')?.count || 0
            },
            totalAmenities,
            upcomingEvents,
            todayVisitors
        };

        return successResponse(res, dashboardData, 'Dashboard data fetched successfully');
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        return errorResponse(res, error.message || 'Failed to fetch dashboard stats', 500);
    }
};

export const getRecentActivities = async (req, res) => {
    try {
        const { buildingId, limit = 10 } = req.query;

        if (!buildingId) {
            return errorResponse(res, 'Building ID is required', 400);
        }

        const buildingObjectId = new mongoose.Types.ObjectId(buildingId);

        // Get recent complaints
        const recentComplaints = await ComplaintsModel.find({
            buildingId: buildingObjectId,
            isDeleted: false
        })
            .populate('memberId', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .select('title complaintStatus category createdAt');

        // Get recent visitors
        const recentVisitors = await VisitorsModel.find({
            buildingId: buildingObjectId,
            isDeleted: false
        })
            .populate('unitId', 'unitNumber')
            .sort({ checkInTime: -1 })
            .limit(parseInt(limit))
            .select('visitorName purpose checkInTime checkOutTime');

        const activities = {
            recentComplaints,
            recentVisitors
        };

        return successResponse(res, activities, 'Recent activities fetched successfully');
    } catch (error) {
        console.error('Get recent activities error:', error);
        return errorResponse(res, error.message || 'Failed to fetch recent activities', 500);
    }
};
