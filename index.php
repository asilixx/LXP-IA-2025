<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/LXP-IA-2025/assets/css/main.css">
    <title>Negotiation</title>
</head>
<body>
    <main>
        <?php if (isset($_GET['page'])){
            include('views/pages/' .$_GET['page'] .'.php'); 
        } else {
            include('views/pages/home.php');
        }
        ?>
    </main>
    <form action="">
        <input type="text">
        <button type="submit"></button>
    </form>
</body>
</html>