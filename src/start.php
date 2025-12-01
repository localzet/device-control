<?php

use localzet\Core\Server;
use localzet\SocketIO\Socket;
use localzet\SocketIO\SocketIO;
use Rust\AndroidManage\includes\Constants;

require_once __DIR__ . '/vendor/autoload.php';

$io = new SocketIO(Constants::$control_port);
$io->on('connection', function (Socket $socket) use ($io) {
    $socket->emit('welcome');
    $socket->on('chat message', function ($msg) use ($io) {
        $io->emit('chat message', $msg);
    });
});

Server::runAll();
