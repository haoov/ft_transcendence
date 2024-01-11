PROJDIR		=	$(realpath $(CURDIR))
SRC			=	$(CURDIR)/src
USE			=	$(shell cat /etc/hostname)

all : build run

ifneq (,$(findstring 42paris,$(USE)))
    SUDO	=	
else
    # SUDO	=	/bin/sudo
endif

build :
	@cd $(SRC) && $(SUDO) docker compose build

run :
	@cd $(SRC) && $(SUDO) docker compose up -d

stop :
	@cd $(SRC) && $(SUDO) docker compose stop

clean:
	@cd $(SRC) && $(SUDO) docker compose down -v
	# @$(SUDO) docker system prune -f

fclean : clean
	@$(SUDO) rm -rf src/backend/postgresql/data/*

test :
	@echo $(SUDO)

.PHONY : build run clean fclean
