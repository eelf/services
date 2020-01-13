### Install server dependencies
    cd server
    composer install --ignore-platform-reqs

### Generate google protobuf (bootstrap)
See server/vendor/eelf/protobuf/plugin.php

### Generate protobuf
    protoc --kek_out=proto --kek_opt='\Eelf\WebJson\Renderer,\Eelf\WebJson\RendererJs' --plugin=protoc-gen-kek=server/vendor/eelf/protobuf/plugin.php proto/s.proto

## Development

### Install client dependencies (dev)
    cd client
    php build.php development

### Compile client
    cd client
    node_modules/webpack/bin/webpack.js -w

### Start php dev webserver
    php -dextension=json.so -S 0.0.0.0:8080 -t web

### Open browser
http://localhost:8080/

## Production

### Install client dependencies
    cd client
    php build.php production

### Compile client
    cd client
    node_modules/webpack/bin/webpack.js

### Deploy to webserver
Somehow

## Cleanup
    cd client
    php build.php clean
    rm -rf $HOME/nodem $HOME/.yarnrc $HOME/.config/yarn
