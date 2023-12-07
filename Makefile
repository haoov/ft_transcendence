PROJDIR		=	$(realpath $(CURDIR))
SRC			=	$(CURDIR)/src

SUDO		=	/usr/bin/sudo

all : build run

build :
	@cd $(SRC) && docker compose build

run :
	@cd $(SRC) && docker compose up -d

stop :
	@cd $(SRC) && docker compose stop

clean:
	@cd $(SRC) && docker compose down -v
	@docker system prune -f

# fclean : clean
# 	@rm -rf src/backend/postgresql/data/*

.PHONY : build run clean fclean
