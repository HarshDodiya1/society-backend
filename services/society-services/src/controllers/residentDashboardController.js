import UnitsModel from '../models/Units.js';
import NoticesModel from '../models/Notices.js';
import ComplaintsModel from '../models/Complaints.js';
import MaintenanceBillsModel from '../models/MaintenanceBills.js';
import EventsModel from '../models/Events.js';
import VisitorsModel from '../models/Visitors.js';
import ParkingSpotsModel from '../models/ParkingSpots.js';
import AmenityBookingsModel from '../models/AmenityBookings.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Get resident dashboard data
export const getResidentDashboard = async (req, res) => {
    try {
        const { unitId } = req.query;

        if (!unitId) {
            return errorResponse(res, 'Unit ID is required', 400);
        }

        // Get unit details
        const unit = await UnitsModel.findById(unitId)
            .populate('floorId')
            .populate({
                path: 'floorId',
                populate: { path: 'blockId' }
            });

        if (!unit) {
            return errorResponse(res, 'Unit not found', 404);
        }

        const buildingId = unit.floorId?.blockId?.buildingId;

        // Get recent notices (last 5)
        const recentNotices = await NoticesModel.find({
            buildingId,
            noticeStatus: 'published',
            isDeleted: false,
            $or: [
                { blockIds: { $size: 0 } },
                { blockIds: unit.floorId.blockId._id }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title message createdAt noticeStatus');

        // Get active complaints count
        const complaintsCount = await ComplaintsModel.countDocuments({
            unitId,
            complaintStatus: { $in: ['open', 'in-process', 're-open'] },
            isDeleted: false
        });

        // Get pending maintenance bill
        const pendingBill = await MaintenanceBillsModel.findOne({
            unitId,
            isPaid: false
        })
            .sort({ dueDate: -1 });

        // Get upcoming events (next 3)
        const upcomingEvents = await EventsModel.find({
            buildingId,
            eventStatus: 'published',
            eventDate: { $gte: new Date() },
            isDeleted: false
        })
            .sort({ eventDate: 1 })
            .limit(3)
            .select('title eventDate startTime endTime venue');

        // Get parking spot
        const parkingSpot = await ParkingSpotsModel.findOne({
            unitId,
            spotStatus: 'occupied',
            isDeleted: false
        }).populate('parkingAreaId');

        // Get today's visitors
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const todayVisitors = await VisitorsModel.countDocuments({
            unitId,
            visitDate: { $gte: todayStart, $lte: todayEnd },
            isDeleted: false
        });

        // Get active amenity bookings
        const activeBookings = await AmenityBookingsModel.countDocuments({
            unitId,
            bookingStatus: { $in: ['confirmed', 'pending'] },
            bookingDate: { $gte: new Date() },
            isDeleted: false
        });

        const dashboardData = {
            unitInfo: {
                unitNumber: unit.unitNumber,
                unitType: unit.unitType,
                area: unit.area,
                floor: unit.floorId?.floorName,
                block: unit.floorId?.blockId?.blockName,
                unitStatus: unit.unitStatus
            },
            quickStats: {
                activeComplaints: complaintsCount,
                todayVisitors,
                activeBookings,
                hasPendingBill: !!pendingBill
            },
            recentNotices,
            pendingBill: pendingBill ? {
                _id: pendingBill._id,
                month: pendingBill.month,
                year: pendingBill.year,
                amount: pendingBill.amount,
                dueDate: pendingBill.dueDate
            } : null,
            upcomingEvents,
            parkingInfo: parkingSpot ? {
                spotNumber: parkingSpot.spotNumber,
                areaName: parkingSpot.parkingAreaId?.areaName,
                spotType: parkingSpot.spotType
            } : null
        };

        return successResponse(res, dashboardData, 'Dashboard data fetched successfully');
    } catch (error) {
        console.error('Get resident dashboard error:', error);
        return errorResponse(res, error.message || 'Failed to fetch dashboard data', 500);
    }
};

// Get quick stats only
export const getQuickStats = async (req, res) => {
    try {
        const { unitId } = req.query;

        if (!unitId) {
            return errorResponse(res, 'Unit ID is required', 400);
        }

        const unit = await UnitsModel.findById(unitId);
        if (!unit) {
            return errorResponse(res, 'Unit not found', 404);
        }

        const [complaintsCount, todayVisitors, activeBookings, pendingBill] = await Promise.all([
            ComplaintsModel.countDocuments({
                unitId,
                complaintStatus: { $in: ['open', 'in-process', 're-open'] },
                isDeleted: false
            }),
            VisitorsModel.countDocuments({
                unitId,
                visitDate: { $gte: new Date().setHours(0, 0, 0, 0) },
                isDeleted: false
            }),
            AmenityBookingsModel.countDocuments({
                unitId,
                bookingStatus: { $in: ['confirmed', 'pending'] },
                bookingDate: { $gte: new Date() },
                isDeleted: false
            }),
            MaintenanceBillsModel.findOne({
                unitId,
                isPaid: false
            }).sort({ dueDate: -1 })
        ]);

        return successResponse(res, {
            activeComplaints: complaintsCount,
            todayVisitors,
            activeBookings,
            hasPendingBill: !!pendingBill
        }, 'Quick stats fetched successfully');
    } catch (error) {
        console.error('Get quick stats error:', error);
        return errorResponse(res, error.message || 'Failed to fetch stats', 500);
    }
};
