import { verifyToken } from '../utils/tokenHelper.js';
import { errorResponse } from '../utils/response.js';
import { USER_TYPES } from '../utils/constants.js';

export const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return errorResponse(res, 'Authentication token is required', 401);
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return errorResponse(res, 'Invalid or expired token', 401);
        }

        req.user = decoded;
        next();
    } catch (error) {
        return errorResponse(res, 'Authentication failed', 401);
    }
};

export const isSuperAdmin = (req, res, next) => {
    if (req.user.userType !== USER_TYPES.SUPER_ADMIN) {
        return errorResponse(res, 'Access denied. Super Admin only.', 403);
    }
    next();
};

export const isBuildingAdmin = (req, res, next) => {
    if (req.user.userType !== USER_TYPES.BUILDING_ADMIN) {
        return errorResponse(res, 'Access denied. Building Admin only.', 403);
    }
    next();
};