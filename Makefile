.PHONY: gen test list

gen:
	npm run gen $(problem) -- --lang=$(lang)

test:
	npm run test $(problem) -- --lang=$(lang)

list:
	npm run list
