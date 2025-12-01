import { Request, Response } from 'express';
import {fn, col, Order} from 'sequelize';
import Inventory from '../models/Inventory';
import Location from '../models/Location';

interface InventoryItemInput {
    name: string;
    locationId: string;
    price: string | number;
}

export const getInventoryItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;
        const locationId = req.query.locationId as string;
        const sortBy = (req.query.sortBy as string) || 'name';
        const sortOrder = (req.query.sortOrder as string) || 'ASC';

        const whereClause: { locationId?: string } = {};
        if (locationId && locationId !== 'all') {
            whereClause.locationId = locationId;
        }

        let order: Order = [];
        if (sortBy === 'location') {
            order = [[{ model: Location, as: 'location' }, 'name', sortOrder]];
        } else {
            order = [[sortBy, sortOrder]];
        }


        const { count, rows } = await Inventory.findAndCountAll({
            where: whereClause,
            include: [{
                model: Location,
                as: 'location',
                attributes: ['id', 'name']
            }],
            order: order,
            limit,
            offset,
        });

        res.json({
            items: rows,
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
        });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Failed to fetch inventory items' });
    }
};

export const createInventoryItem = async (req: Request<unknown, unknown, InventoryItemInput>, res: Response): Promise<void> => {
    try {
        const { name, locationId, price } = req.body;

        if (!name || !locationId || !price) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }

        const item = await Inventory.create({
            name,
            locationId,
            price: typeof price === 'string' ? parseFloat(price) : price,
        });

        const itemWithLocation = await Inventory.findByPk(item.id, {
            include: [{
                model: Location,
                as: 'location',
                attributes: ['id', 'name']
            }]
        });

        res.status(201).json(itemWithLocation);
    } catch (error) {
        console.error('Error creating inventory item:', error);
        res.status(500).json({ error: 'Failed to create inventory item' });
    }
};

export const deleteInventoryItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await Inventory.destroy({ where: { id } });

        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({ error: 'Failed to delete inventory item' });
    }
};

export const getLocations = async (_req: Request, res: Response): Promise<void> => {
    try {
        const locations = await Location.findAll({
            order: [['name', 'ASC']],
        });
        res.json(locations);
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
};

export const getStatistics = async (_req: Request, res: Response): Promise<void> => {
    try {
        const statistics = await Inventory.findAll({
            attributes: [
                [col('location.name'), 'locationName'],
                [fn('COUNT', col('Inventory.id')), 'totalProducts'],
                [fn('SUM', col('Inventory.price')), 'totalPrice'],
            ],
            include: [{
                model: Location,
                as: 'location',
                attributes: [],
            }],
            group: ['location.id', 'location.name'],
            raw: true,
        });

        res.json(statistics);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};