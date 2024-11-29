# Storm Project

This project is a Node.js applica2on that provides various services including
dashboard data, DMA (District Metered Area) opera2ons, gateway management, meter
readings, zone management etc..,.

## Features

- **Database Integration**: Supports seamless integration with databases using Sequelize ORM.
- **REST API Endpoints**: Provides multiple endpoints for handling resources such as posts, keys, clients, zones, and more.
- **Middleware Support**: Includes middleware for CORS, request parsing, and custom logic.
- **Modular Architecture**: Features a modular design with separate route and model files for scalability and maintainability.

**Overview**:
This project is a Node.js applica2on that provides various services including
dashboard data, DMA (District Metered Area) opera2ons, gateway management, meter
readings, zone management etc..,.

**Technologies Used**:
• Node.js
• Express
• MySql

**Prerequisites**:
• Node.js: 22.3.0
• Package Manager: npm

**Installation**:
Below are the step-by-step instruc2ons to setup the project locally.
• git clone -b main hNps://github.com/rty0247/storm.git
• cd storm
• npm install -f

**Configuration**:
This is how we configure environment variables in .env file.
• DB_SCHEMA=storm
• DB_USERNAME=MySqlUser
• DB_PASSWORD=Admin@1234
• DB_HOST=49.207.11.223
• DB_DIALECT=mysql

**Running The Application**:
Execute this command to start the applica2on.
• npm start

**Project Structure**:
.
|------- src
| |
| |----- config
| | |
| | |----- db.js
| | |----- imageConfig.js
| |
| |----- controllers
| | |----- ClientController.js
| | |----- Controller.js
| | |----- DashboardController.js
| | |----- DMAController.js
| | |----- GatewayController.js
| | |----- MeterController.js
| | |----- userController.js
| | |----- ZoneController.js
| |
| |----- routes
| |----- clientRoutes.js
| |----- dashboardRoutes.js
| |----- dmaRoutes.js
| |----- gatewayRoutes.js
| |----- imageUploadRoutes.js
| |----- meterRoutes.js
| |----- Routes.js
| |----- zoneRoutes.js
|------- .env
|------- app.js
|------- sync.js
|------- index.js
|------- README.md