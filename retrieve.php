<?php
$url = "http://www.pwcalc.com/loadgt.php?jsonData=%7B%22stat%22%3A%22l2%22,%22text%22:%22".$_GET["profile"]."%22%7D";
$json = file_get_contents($url);
echo $json;
?>