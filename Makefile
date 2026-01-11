.PHONY: add gen test list stats help

help:
	@echo "LeetLocal - Available Commands:"
	@echo ""
	@echo "  make add              - Create a new problem (interactive)"
	@echo "  make gen problem=<id> lang=<js|python> - Generate solution template"
	@echo "  make test problem=<id> lang=<js|python> - Run tests"
	@echo "  make list             - List all problems"
	@echo "  make stats            - Show progress and generate GitHub markdown"
	@echo ""

add:
	npm run add

gen:
	npm run gen $(problem) -- --lang=$(lang)

test:
	npm run test $(problem) -- --lang=$(lang)

list:
	npm run list

stats:
	npm run stats
