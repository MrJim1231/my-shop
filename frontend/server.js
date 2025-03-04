import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = process.env.PORT || 3000

// Для корректного получения пути к текущей директории в ES-модулях
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Указываем папку с продакшн-сборкой
app.use(express.static(path.join(__dirname, 'dist')))

// Все запросы, не попадающие на файлы, перенаправляем на index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`)
})
