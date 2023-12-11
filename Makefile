PROJDIR		=	$(realpath $(CURDIR))
SRC			=	$(CURDIR)/src

SUDO		=	/usr/bin/sudo

all : build run

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

.PHONY : build run clean fclean
