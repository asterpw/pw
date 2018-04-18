<?php
    header('Content-type: application/json');
    header('Access-Control-Allow-Origin: *');

$q = $_REQUEST["q"];
$filename = "";
if ($q=="twilight" or $q=="etherblade" or $q=="dawnglory" or $q=="tideswell" or $q=="cygnus" or $q=="arcadia" or $q=="pegasus" or $q=="hydra" or $q=="draco" or $q=="lynx" ) { 
	$filename = "record-".$q.".json";
} else {
	echo '{"error":"invalid server"}';
	return;
}
echo file_get_contents($filename);
?>