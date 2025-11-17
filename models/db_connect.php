<?php 

    function dbConnect() {
    $db = new PDO(
        'mysql:host=localhost;dbname=lxp;charset=utf8',
        'root',
        '',
    );
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $db->exec('SET NAMES utf8');
    return $db;

}
?>