import dotenv from "dotenv";
import express from "express";
import cors from "cors";
/** импорт консоли для его корректной работы  */
import console from "console";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
/** Используем библиотеку express-rate-limit для защиты от DDoS атак */
import { rateLimit } from "express-rate-limit";
/** Используем библиотеку helmet для защиты от кибератак */
import helmet from "helmet";
// import config from './config.js';
import router from "./routes/index.js";
import centralErrors from "./middlewares/centralErrors.js";

dotenv.config();

const { PORT = 3000, MONGODB_URI = "mongodb://127.0.0.1:27017/bitfilmsdb" } =
  process.env;

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "94.51.53.231",
      "94.51.53.231:3000",
      "http://94.51.53.231",
      "http://94.51.53.231:3000",
      "https://api.riyarmdiplom.nomoredomains.rocks",
      "https://riyarmdiplom.nomoredomains.rocks",
    ],
    credentials: true,
    maxAge: 60,
  })
);

app.use(cookieParser());

/** Конфигурация лимитера  */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000, // запросов с одного IP в течении поля "windowsMs"
  standardHeaders: true, // Возврщает заголовок с инофрмацией лимита
  legacyHeaders: false, // Отключает референсный заголовок ответа библиотеки
});

mongoose.connect(MONGODB_URI, {});

/* врубаем хелмет */
app.use(helmet());

/* парсер */
app.use(express.json());

app.use("/", router);

/* подключаем лимитер */
app.use(limiter);

/* Централлизованная обработка ошибок */
app.use(centralErrors);

app.listen(PORT, () => {
  console.log(`Добро пожаловать в интернет, ты на порту ${PORT} `);
});
