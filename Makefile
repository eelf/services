PLUGIN_PATH = server/vendor/eelf/protobuf
PLUGIN = $(PLUGIN_PATH)/plugin.php
PROTOBUF = $(HOME)/homebrew/include/google/protobuf
PWD = $(shell pwd)

.PHONY: client docker server proto

all: proto client

client:
	cd client && php build.php development && webpack

server:
	cd server && composer install

proto: server
	protoc --my_out='Eelf\Protobuf\Renderer':$(PLUGIN_PATH)/proto --plugin=protoc-gen-my=$(PLUGIN) -I$(PROTOBUF) $(PROTOBUF)/compiler/plugin.proto
	test -d server/proto || mkdir server/proto
	protoc --my_out='Eelf\Protobuf\Renderer,Eelf\WebJson\Renderer':server/proto --plugin=protoc-gen-my=$(PLUGIN) proto/s.proto
	test -d client/proto || mkdir client/proto
	protoc --my_out='Eelf\WebJson\RendererJs':client/proto --plugin=protoc-gen-my=$(PLUGIN) proto/s.proto
	protoc --js_out=import_style=commonjs,binary:client/proto proto/s.proto

start_php:
	php -S 0.0.0.0:8080 -t web


docker:
	docker build -t web docker

start:
	docker run -d --name web1 -p 8082:80 -v $(PWD):/local web

stop:
	docker rm -f web1


clean:
	rm -rf server/proto server/vendor server/composer.lock client/proto
	cd client && php build.php clean

