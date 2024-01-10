PROJDIR		=	$(realpath $(CURDIR))
SRC			=	$(CURDIR)/src

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

re: clean all

# fclean : clean
# 	@rm -rf src/backend/postgresql/data/*

.PHONY : build run clean fclean re
