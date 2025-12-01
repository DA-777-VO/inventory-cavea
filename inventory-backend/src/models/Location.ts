import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

interface LocationAttributes {
    id: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

class Location extends Model<LocationAttributes, Optional<LocationAttributes, 'id'>>
    implements LocationAttributes {
    public id!: string;
    public name!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Location.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        tableName: 'locations',
        timestamps: true,
    }
);

export default Location;