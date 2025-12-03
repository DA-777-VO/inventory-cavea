import Location from '../models/Location';

interface LocationType {
    id: string;
    name: string;
}


const findById = async (id: string): Promise<LocationType | null> => {
    const location = await Location.findByPk(id);
    return location ? (location.toJSON()) : null;
};

const create = async (name: string): Promise<LocationType> => {
    const location = await Location.create({ name });
    return location.toJSON();
};

const update = async (id: string, name: string): Promise<LocationType | null> => {
    const location = await Location.findByPk(id);

    if (!location) {
        return null;
    }

    location.name = name;
    await location.save();

    return location.toJSON();
};

const remove = async (id: string): Promise<boolean> => {
    const deleted = await Location.destroy({ where: { id } });
    return deleted > 0;
};


const seedLocations = async (): Promise<void> => {
    const count = await Location.count();

    if (count === 0) {
        await Location.bulkCreate([
            { name: 'მთავარი ოფისი' },
            { name: 'კავეა გალერია' },
            { name: 'კავეა თბილისი მოლი' },
            { name: 'კავეა ისთ ფოინთი' },
            { name: 'კავეა სითი მოლი' },
        ]);
        console.log('Locations seeded successfully.');
    }
};

export default {
    findById,
    create,
    update,
    remove,
    seedLocations,
};