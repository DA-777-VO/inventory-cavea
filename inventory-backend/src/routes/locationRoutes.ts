import express, { Request, Response, NextFunction } from 'express';
import locationService from '../services/locationService';

const router = express.Router();


router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const location = await locationService.findById(id);

        if (location) {
            res.json(location);
        } else {
            res.status(404).json({ error: 'Location not found' });
        }
    } catch (error) {
        console.error('Error fetching location by ID:', error);
        next(error);
    }
});


router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name } = req.body as { name?: unknown };
        if (!name || typeof name !== 'string' || name.trim() === '') {
            res.status(400).json({ error: 'Name is required' });
            return;
        }

        const newLocation = await locationService.create(name.trim());
        res.status(201).json(newLocation);
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'name' in error && error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: 'Location with this name already exists' });
            return;
        }
        console.error('Error creating location:', error);
        next(error);
    }
});


router.put('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id;
        const { name } = req.body as { name?: unknown };

        if (!name || typeof name !== 'string' || name.trim() === '') {
            res.status(400).json({ error: 'Name is required and must be a non-empty string' });
            return;
        }

        const updatedLocation = await locationService.update(id, name.trim());

        if (updatedLocation) {
            res.json(updatedLocation);
        } else {
            res.status(404).json({ error: 'Location not found' });
        }
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'name' in error && error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: 'Location with this name already exists' });
            return;
        }
        console.error('Error updating location:', error);
        next(error);
    }
});


router.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id;
        const deleted = await locationService.remove(id);

        if (deleted) {
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'Location not found' });
        }
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'name' in error && error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(400).json({
                error: 'Cannot delete location with existing inventory items'
            });
            return;
        }
        console.error('Error deleting location:', error);
        next(error);
    }
});

export default router;