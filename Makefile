PROJDIR		=	$(realpath $(CURDIR))
SRC			=	$(CURDIR)/src
HOSTNAME	=	$(shell hostname)
LOCAL_ADDR 	= 	$(shell ip route get 1 | awk '{print $$7}' | tr -d '\n')

ifneq (,$(findstring 42paris,$(HOSTNAME)))
    SUDO =	
else
    SUDO = /usr/bin/sudo
endif

all : build run

set_local_addr :
	@if [ -z "$(LOCAL_ADDR)" ]; then \
		echo "No ip address found"; \
		exit 1; \
	else \
		echo "Setting server ip address..."; \
		sed -i 's/\(LOCAL_ADDRESS\).*/\1=$(LOCAL_ADDR)/g' $(SRC)/.env; \
		sed -i 's/\(VITE_HOSTNAME\).*/\1=$(LOCAL_ADDR)/g' $(SRC)/frontend/vuejs/app/.env; \
		sed -i 's/.*\(3000:80\)/      - $(LOCAL_ADDR):3000:80/g' $(SRC)/docker-compose.yml; \
	fi
	@echo "Server ip address set to $(LOCAL_ADDR)"

set_localhost :
	@sed -i 's/\(LOCAL_ADDRESS\).*/\1=localhost/g' $(SRC)/.env
	@sed -i 's/\(VITE_HOSTNAME\).*/\1=localhost/g' $(SRC)/frontend/vuejs/app/.env
	@sed -i 's/.*\(3000:80\)/      - 3000:80/g' $(SRC)/docker-compose.yml
	@echo "Server ip address set to localhost"

build :
	@cd $(SRC) && $(SUDO) docker compose build

run :
	@cd $(SRC) && $(SUDO) docker compose up -d

stop :
	@cd $(SRC) && $(SUDO) docker compose stop

clean:
	@cd $(SRC) && $(SUDO) docker compose down -v
	@docker system prune -f

re: clean all

# fclean : clean
# 	@rm -rf src/backend/postgresql/data/*

.PHONY : set_localhost set_local_addr build run clean fclean re
