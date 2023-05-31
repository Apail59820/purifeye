<?php
    session_start();

    if(isset($_POST['username']) && !empty($_POST['username']))
    {
        $usr = htmlspecialchars($_POST['username']);
        if(isset($_POST['pswd']) && !empty($_POST['pswd']))
        {
            $password = htmlspecialchars($_POST['pswd']);

            $servername = "eu-cdbr-west-03.cleardb.net"; 
            $dbusername = "b5b39d52f466ad"; 
            $dbpassword = "eab3317c"; 
            $dbname = "heroku_56366cbee5ccd56";

            try {
                $conn = new PDO("mysql:host=$servername;dbname=$dbname", $dbusername, $dbpassword);
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                
                $query = "SELECT password FROM utilisateurs WHERE username=:username";
                
                $stmt = $conn->prepare($query);
                $stmt->bindParam('username', $usr, PDO_PARAM_STR(30));

                $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

                foreach ($results as $row) {
                    if(password_verify($password, $row['password'])){
                        $_SESSION['auth'] = $row['auth'];
                        header("Location: index.php?tab=overview");
                        exit;
                    }else{
                        header("Location: login.html?err=passwordmatch");
                        exit;
                    }
                }
            } catch(PDOException $e) {
                echo "Erreur de connexion à la base de données : " . $e->getMessage();
            }
        }else{
            header("Location: login.html?err=password");
            exit;
        }
    }else{
        header("Location: login.html?err=username");
        exit;
    }

?>