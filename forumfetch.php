<?php
$url = "http://pwi-forum.perfectworld.com/".$_GET["link"];
$json = file_get_contents($url);
echo $json;
?>