import { Router } from 'express';
import {
    getInventoryItems,
    createInventoryItem,
    deleteInventoryItem,
    getLocations,
    getStatistics,
} from '../controllers/inventoryController';

const router = Router();

router.get('/inventory', getInventoryItems);
router.post('/inventory', createInventoryItem);
router.delete('/inventory/:id', deleteInventoryItem);
router.get('/locations', getLocations);
router.get('/statistics', getStatistics);

export default router;