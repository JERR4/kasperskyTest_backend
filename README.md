# JS\_Тестовое задание – Backend

## Описание проекта

Backend приложения реализован на NestJS и TypeORM с использованием SQLite.
Предоставляет REST API для управления пользователями и группами, включая CRUD операции.

Особенности:

* API поддерживает фильтры по имени, email, группам, сортировку и пагинацию.
* Валидация данных на стороне сервера, соответствующая фронтенду.
* Скрипт для резервного копирования и восстановления данных.

## Стек технологий

* NestJS
* TypeORM
* SQLite

## Установка и запуск

```bash
git clone https://github.com/JERR4/kasperskyTest_backend.git
cd kasperskyTest_backend
npm install
```

### Настройка базы данных

* Используется SQLite, файл хранится в `backend/database.sqlite`.
* Для заполнения базы начальными данными (400 пользователей, 5 групп):

```bash
ts-node src/seed.ts
```

### Запуск сервера

```bash
npm run start:dev
```

Сервер будет доступен по адресу: `http://localhost:3000`

## Скрипт бэкапа и восстановления

### Экспорт данных

```bash
ts-node src/backup/backup.cli.ts export [путь_к_файлу]
```

По умолчанию: `backup.json` в корне проекта.

### Восстановление данных

```bash
ts-node src/backup/backup.cli.ts restore [путь_к_файлу]
```

Если путь не указан, скрипт ищет `backup.json` в корне проекта.