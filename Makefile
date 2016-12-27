all: deploy

build:
	gulp build

deploy: build
	cd dest; sls deploy

invoke: deploy
	cd dest; sls invoke -f hello

local: build
	cd dest; sls invoke local -f hello

clean:
	rm -r dest