import Location from "./models/Location";
import Inventory from "./models/Inventory";
import sequelize from "./database";

const LOCATIONS = [
    'მთავარი ოფისი',
    'კავეა გალერია',
    'კავეა თბილისი მოლი',
    'კავეა ისთ ფოინთი',
    'კავეა სითი მოლი'
];

const seed = async () => {
    await sequelize.authenticate();
    console.log('Connected to DB...');


    console.log('Seeding locations...');
    await Location.sync({ force: true });
    await Inventory.sync({ force: true });

    const createdLocations = await Location.bulkCreate(
        LOCATIONS.map(name => ({ name }))
    );

    const locationIds = createdLocations.map(l => l.id);

    console.log('Seeding 500,000 inventories. This may take a while...');

    const TOTAL_RECORDS = 500000;
    const BATCH_SIZE = 5000;

    for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
        const batch = [];
        for (let j = 0; j < BATCH_SIZE; j++) {
            const randomLocId: string = String(locationIds[Math.floor(Math.random() * locationIds.length)]);

            batch.push({
                name: `Item ${i + j + 1}`,
                price: Math.floor(Math.random() * 500) + 10,
                locationId: randomLocId
            });
        }

        await Inventory.bulkCreate(batch);
        // progress bar
        if ((i + BATCH_SIZE) % 50000 === 0) {
            console.log(`Inserted ${i + BATCH_SIZE} records...`);
        }
    }

    console.log('Done!');
    process.exit(0);
};

seed().catch(err => {
    console.error(err);
    process.exit(1);
});