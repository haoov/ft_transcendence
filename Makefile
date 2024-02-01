PROJDIR        =    $(realpath $(CURDIR))
PATH        =    $(PROJDIR)/src
SRC            =    $(CURDIR)
HOSTNAME    =    $(shell hostname)
LOCAL_ADDR     =     $(shell ip route get 1 | awk '{print $$7}' | tr -d '\n')
LOCAL_ADDRESS     =     $(shell grep LOCAL_ADDRESS .env | cut -d '=' -f 2 | tr -d '[:space:]')

ifneq (,$(findstring 42paris,$(HOSTNAME)))
    SUDO =    
else
    SUDO = /usr/bin/sudo
endif

all : build run
    @/bin/sed -i 's/\(VITE_HOSTNAME\).*/\1=$(LOCAL_ADDRESS)/g' $(PATH)/frontend/vuejs/app/.env
    @/bin/sed -i 's/.*\(3000:80\)/      - $(LOCAL_ADDR):3000:80/g' docker-compose.yml

set_local_addr :
    @if [ -z "$(LOCAL_ADDR)" ]; then \
        echo "No ip address found"; \
        exit 1; \
    else \
        echo "Setting server ip address..."; \
        /bin/sed -i 's/\(LOCAL_ADDRESS\).*/\1=$(LOCAL_ADDR)/g' .env; \
        /bin/sed -i 's/\(VITE_HOSTNAME\).*/\1=$(LOCAL_ADDR)/g' $(PATH)/frontend/vuejs/app/.env; \
        /bin/sed -i 's/.*\(3000:80\)/      - $(LOCAL_ADDR):3000:80/g' docker-compose.yml; \

    fi
    @echo "Server ip address set to $(LOCAL_ADDR)"

set_localhost :
    @/bin/sed -i 's/\(LOCAL_ADDRESS\).*/\1=localhost/g' .env
    @/bin/sed -i 's/\(VITE_HOSTNAME\).*/\1=localhost/g' $(PATH)/frontend/vuejs/app/.env
    @/bin/sed -i 's/.*\(3000:80\)/      - 3000:80/g' docker-compose.yml
    @echo "Server ip address set to localhost"

build :
    @$(SUDO) /bin/docker compose build

run :
    @$(SUDO) /bin/docker compose up -d

stop :
    @$(SUDO) /bin/docker compose stop

clean:
    @$(SUDO) /bin/docker compose down -v
    @$(SUDO) /bin/docker system prune -f -a
    @$(SUDO) /bin/rm -rf src/backend/nestjs/api/src/user/avatar-uploads/*

re: clean all

fclean : clean
    @$(SUDO) /bin/rm -rf src/backend/postgresql/data/*
    @$(SUDO) /bin/rm -rf src/backend/nestjs/api/dist/*

.PHONY : set_localhost set_local_addr build run clean fclean re