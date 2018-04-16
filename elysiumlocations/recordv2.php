<?php

require('../lib/recaptcha/autoload.php');

function tailFile($filepath, $lines = 1) {
	return trim(implode("", array_slice(file($filepath), -$lines)));
}

$siteKey = '6LfULR4TAAAAAKbR_S0t-H025tlQFnX6GFZC9t9L';
$secret = '6LfULR4TAAAAAAXiNP8rm_Sv2bKC-2bRniGGl8BD';

$recaptcha = new \ReCaptcha\ReCaptcha($secret);
$resp = $recaptcha->verify($_POST['token'], $_SERVER['REMOTE_ADDR']);
if ($resp->isSuccess()) {
} else {
    $errors = $resp->getErrorCodes();
	echo '{"result":"invalid request"}';
	return;
}

$q = $_POST["q"];
$type = $_POST["type"];
$name = $_POST["name"];
$loc = $_POST["loc"];
$id = md5($_SERVER['REMOTE_ADDR']);

$filename = "";
if ($q=="twilight" or $q=="etherblade" or $q=="dawnglory" or $q=="tideswell" or $q=="cygnus" or $q=="arcadia" or $q=="pegasus" or $q=="hydra" or $q=="draco" or $q=="lynx" ) { 
	$filename = "record-".$q.".json";
} else {
	echo '{"result":"invalid server"}';
	return;
}
if (!is_numeric($type) or $type < 0 or $type > 1) { 
	echo '{"result":"invalid type"}'; 
	return; 
}
if (!is_numeric($name) or $name < 0 or ($type == 0 and $name >= 13) or ($type == 1 and $name >=10)) { 
	echo '{"result":"invalid name"}';
	return; 
}
if (!is_numeric($loc) or $loc < 1 or ($type == 0 and $loc > 52) or ($type == 1 and $loc >3)) { 
	echo '{"result":"invalid location"}'; 
	return; 
}

$json_data = file_get_contents($filename);
$json = json_decode($json_data, true);
$record = array("time" => time(), 
		"type" => (int) $type,
		"npc" => (int) $name,
		"loc" => (int) $loc,
		"id" => $id);

$elemRemove = -1;
foreach ($json['records'] as $key => $curr) {
    if($id == $curr['id'] and $type == $curr['type']) {
        $elemRemove = $key;
    }
}
if ($elemRemove >= 0) {
	array_splice($json['records'], $elemRemove, 1);
}
array_push($json['records'], $record);
while (count($json['records']) > 20) {
	array_shift($json['records']);
}

file_put_contents ($filename , json_encode($json));
echo '{"result":"success"}';
?>