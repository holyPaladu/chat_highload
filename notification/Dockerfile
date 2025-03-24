# Используем официальный Node.js образ
FROM node:20-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Выполняем сборку NestJS (создание dist/)
RUN npm run build

# Убираем dev-зависимости (если они не нужны в финальном образе)
RUN npm prune --production


# --- Финальный образ ---
FROM node:20-alpine AS runner

WORKDIR /app

# Копируем только скомпилированные файлы и production-зависимости
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Открываем порт
EXPOSE 3001

# Запускаем приложение
CMD ["node", "dist/main"]
