import express from 'express';
const app = express();
import cors from 'cors';
import inventoryRoutes from "./routes/inventoryRoutes";
import sequelize from "./database";
import Location from "./models/Location";
import locationRoutes from "./routes/locationRoutes";

const PORT = 3000;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api', inventoryRoutes);
app.use('/api/locations', locationRoutes);


const REQUIRED_LOCATIONS = [
    { name: 'მთავარი ოფისი' },
    { name: 'კავეა გალერია' },
    { name: 'კავეა თბილისი მოლი' },
    { name: 'კავეა ისთ ფოინთი' },
    { name: 'კავეა სითი მოლი' }
];

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });

        const count = await Location.count();

        if (count === 0) {
            console.log('The database is empty. Creating required locations...');
            await Location.bulkCreate(REQUIRED_LOCATIONS);
            console.log('Locations successfully created!');
        } else {
            console.log('Locations already exist in the database. Skipping creation.');
        }

        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    } catch (e) {
        console.error(e);
    }
};

void start();


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});