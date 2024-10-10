# Makefile for Docker Compose

# Default target
all: clean build

# Stop and remove all running containers
clean:
	@echo "Stopping and removing containers..."
	docker-compose down

# Remove all Docker images
remove-images:
	@echo "Removing unused Docker images..."
	docker rmi $(docker images -q) || true

# Build and recreate containers
build:
	@echo "Building and recreating containers..."
	docker-compose up --build --force-recreate

# Prune unused Docker resources
prune:
	@echo "Pruning unused Docker resources..."
	docker system prune -a -f

# Combined command to clean, remove images, and build
fresh:
	@echo "Creating fresh containers and deleting past builds..."
	$(MAKE) clean
	$(MAKE) remove-images
	$(MAKE) build
