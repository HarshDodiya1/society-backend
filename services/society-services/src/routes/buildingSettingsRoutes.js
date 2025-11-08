import express from 'express';
import {
    createBlock,
    getBlocks,
    getBlockById,
    updateBlock,
    deleteBlock,
    createFloor,
    createMultipleFloors,
    getFloors,
    getFloorById,
    updateFloor,
    deleteFloor,
    createUnit,
    getUnits,
    getUnitById,
    updateUnit,
    deleteUnit,
    createParkingArea,
    getParkingAreas,
    createParkingSpot,
    getParkingSpots,
    updateParkingArea,
    deleteParkingArea
} from '../controllers/buildingSettingsController.js';

const router = express.Router();

// Block routes
router.post('/blocks', createBlock);
router.get('/blocks', getBlocks);
router.get('/blocks/:id', getBlockById);
router.put('/blocks/:id', updateBlock);
router.delete('/blocks/:id', deleteBlock);

// Floor routes
router.post('/floors', createFloor);
router.post('/floors/bulk', createMultipleFloors);
router.get('/floors', getFloors);
router.get('/floors/:id', getFloorById);
router.put('/floors/:id', updateFloor);
router.delete('/floors/:id', deleteFloor);

// Unit routes
router.post('/units', createUnit);
router.get('/units', getUnits);
router.get('/units/:id', getUnitById);
router.put('/units/:id', updateUnit);
router.delete('/units/:id', deleteUnit);

// Parking routes
router.post('/parking-areas', createParkingArea);
router.get('/parking-areas', getParkingAreas);
router.put('/parking-areas/:id', updateParkingArea);
router.delete('/parking-areas/:id', deleteParkingArea);

router.post('/parking-spots', createParkingSpot);
router.get('/parking-spots', getParkingSpots);

export default router;
