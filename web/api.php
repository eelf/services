<?php

$root_path = realpath(__DIR__ . '/..');
$base_path = $root_path . '/server';

require_once $base_path . '/vendor/autoload.php';
\Eelf\Protobuf\Util::psr4('eelf\\', $base_path . '/proto/eelf');

$body = file_get_contents('php://input');

class Services implements \eelf\svc\Services {
    public function List(\eelf\svc\ListRequest $request) : \eelf\svc\ListResponse
    {
        $response = new \eelf\svc\ListResponse();
        $response->setService(['udb', 'redd']);
        return $response;
    }

    public function Service(\eelf\svc\ServiceRequest $request) : \eelf\svc\ServiceResponse
    {
        $data = ['file' => [
            ['message_type' => [
                ['name' => 'request_user_add', 'field' => [
                    ['name' => 'user_name']
                ]],
                ['name' => 'request_user_remove', 'field' => [
                    ['name' => 'user_id']
                ]],
            ]]
        ]];
        $response = new \eelf\svc\ServiceResponse();
        foreach ($data['file'] as $file) {
            foreach ($file['message_type'] as $m) {
                $meth = new \eelf\svc\ServiceResponse\ServiceMethod();
                $meth->setName($m['name']);
                $meth->setArgs(array_map(function ($e) {
                    return $e['name'];
                }, $m['field']));
                $response->appendMeth($meth);
            }
        }
        return $response;
    }
}

$method = $_SERVER['HTTP_X_METHOD'];
try {
    $resp = (new \Eelf\WebJson\Router)($method, $body, new Services);
} catch (\Throwable $t) {
    trigger_error($t);
}
if ($err) {
    var_dump($err);
} else {
    header('X-Status: Ok');
    echo $resp;
}
