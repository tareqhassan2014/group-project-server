import 'dotenv/config';
import App from './app';

const { PORT, MONGO_CONNECTION_URI } = process.env;

const app = new App(Number(PORT), MONGO_CONNECTION_URI!);

app.listen();
