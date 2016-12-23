all: deploy

tsc: src/*.ts
	cd src; tsc *.ts --outDir ../dest

copy: src/*.yml
	cp src/*.yml ./dest
	cp src/package.json ./dest
	cd dest; npm install

build: tsc copy

deploy: build
	cd dest; sls deploy

invoke: deploy
	cd dest; sls invoke -f hello

local: build
	cd dest; sls invoke local -f hello
