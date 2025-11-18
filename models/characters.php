<?php 

    function fetchCharacters(){
        $db = dbConnect();
        $sql = "SELECT firstName, lastName, chrono
        FROM characters ORDER BY chrono ASC";
        $query = $db->query($sql);
        $characters = $query->fetchAll();
        return $characters;
    }

    function addCharacters($firstName, $lastName, $chrono){
        $db = dbConnect();
        $sql = "INSERT INTO characters (firstName, lastName, chrono)
        VALUES (:firstName, :lastName, :chrono)";
        $query = $db->prepare($sql);
        $query->execute([
            "firstName" => $firstName,
            "lastName" => $lastName,
            "chrono" => $chrono,
        ]);
    }



?>