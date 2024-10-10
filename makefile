# Default target
all: clean build

# Stop and remove all running containers
clean:
	@echo "Stopping and removing containers..."
	docker-compose down

# Remove only dangling Docker images
remove-dangling-images:
	@echo "Removing dangling Docker images..."
	docker image prune -f

# Prune unused volumes
prune-volumes:
	@echo "Pruning unused Docker volumes..."
	docker volume prune -f

# Build and start containers without forcing recreation
build:
	@echo "Building and starting containers..."
	docker-compose up --build

# Prune unused Docker resources
prune:
	@echo "Pruning unused Docker resources..."
	docker system prune -a -f

# Combined command to clean, prune dangling images, prune volumes, and build
fresh:
	@echo "Creating fresh containers and cleaning unused images/volumes..."
	$(MAKE) clean
	$(MAKE) remove-dangling-images
	$(MAKE) prune-volumes
	$(MAKE) build

# Full prune for periodic deep cleaning
full-prune:
	@echo "Running full Docker prune..."
	docker system prune --volumes -a -f
