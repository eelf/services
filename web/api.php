<?php

$err = [];
set_error_handler(function (...$a) use (&$err) {
    $err[] = $a;
});

$root_path = realpath(__DIR__ . '/..');
$base_path = $root_path . '/server';

require_once $base_path . '/vendor/autoload.php';
\Eelf\Protobuf\Util::psr4('google\\', $root_path . '/proto/google');
\Eelf\Protobuf\Util::psr4('eelf\\', $root_path . '/proto/eelf');

\Eelf\Protobuf\Util::ensure_extensions(['json']);

$body = file_get_contents('php://input');

class Services implements \eelf\svc\Services {
    public function List(\google\protobuf\Empty_ $request): \eelf\svc\ServicesList
    {
        $response = new \eelf\svc\ServicesList();
        $response->setService(['udb', 'redd']);
        return $response;
    }

    public function Service(\eelf\svc\ServiceName $request): \eelf\svc\ServiceDescriptor
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
        $response = new \eelf\svc\ServiceDescriptor;
        foreach ($data['file'] as $file) {
            foreach ($file['message_type'] as $m) {
                $meth = new \eelf\svc\ServiceDescriptor\ServiceMethod();
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

header('Content-Type: application/json');
$resp = (new \Eelf\WebJson\Router)($body, new Services);
if ($err) {
    echo "FAIL " . var_export($err, 1) . " $resp";
} else {
    echo $resp;
}
