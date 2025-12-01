import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';
import Location from './Location';

interface InventoryAttributes {
    id: number;
    name: string;
    locationId: string;
    price: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class Inventory extends Model<InventoryAttributes, Optional<InventoryAttributes, 'id'>>
    implements InventoryAttributes {
    public id!: number;
    public name!: string;
    public locationId!: string;
    public price!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Inventory.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        locationId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'location_id',
            references: {
                model: 'locations',
                key: 'id',
            },
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'inventory',
        timestamps: true,
        indexes: [
            {
                fields: ['location_id']
            },
            {
                fields: ['name']
            },
            {
                fields: ['price']
            }
        ]
    }
);

Inventory.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });
Location.hasMany(Inventory, { foreignKey: 'locationId', as: 'inventory' });

export default Inventory;