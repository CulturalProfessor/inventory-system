# Inventory System

## 📦 Project Overview

The **Inventory System** is a web-based solution designed to efficiently manage and track inventory. It offers various features for monitoring products, updating stock levels, and automating basic inventory-related tasks. The project is containerized using Docker, making deployment across different environments simple and quick.

## 🚀 Features

- **Track Products**: Manage product details, including SKU, quantity, price, and more.
- **Stock Updates**: Automatically update stock levels when products are added or removed.
- **Customizable According to Your Data**: You can retrain the model by adding your inventory historical data in csv format according to sample file.
- **Reports**: Generate detailed reports on stock levels, sales, and purchases.
- **Docker Support**: Easily deploy the system using Docker.

## 📂 Project Structure

```bash
├── client/                     # Frontend source code
├── model/                      # Random forest Model
├── server/                     # Backend API and server code
├── .gitignore                  # Files and directories to be ignored by Git
├── docker-compose.yml           # Docker Compose file for multi-container setup
├── makefile                    # Automation tasks for building and running the project
├── test_data_generator.py      # Generate random test historical inventory data
└── README.md                   # Project documentation
```

## 🛠️ Installation

### Prerequisites

- **Docker**: Make sure Docker is installed and running on your machine.
- **Download the `random_forest_model.pkl` file**: This is required for sales prediction. You can download it from the following [Kaggle link](https://www.kaggle.com/code/neerajanandcoder/walmart-sales/output). Place the file in the model directory of the project before proceeding.

### Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/CulturalProfessor/inventory-system.git
   cd inventory-system
   ```

2. **Build and run the Docker container**:

   ```bash
   make build
   # or alternatively
   docker-compose up --build
   ```

3. **Access the system**:

   Once the containers are up and running, open your browser and navigate to:

   ```plaintext
   http://localhost:5137
   ```

   This will allow you to access the inventory management dashboard.
