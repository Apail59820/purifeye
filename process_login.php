<?php
    session_start();

    function getAuthToken($length) {
        $c = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $rStr = '';
    
        for ($i = 0; $i < $length; $i++) {
            $rStr .= $c[rand(0, strlen($c) - 1)];
        }
    
        return $rStr;
    }
    
    if(isset($_POST['username']) && !empty($_POST['username']))
    {
        $pusername = htmlspecialchars($_POST['username']);

        if(isset($_POST['pswd']) && !empty($_POST['pswd']))
        {
            $ppassword = htmlspecialchars($_POST['pswd']);

            $servername = "eu-cdbr-west-03.cleardb.net"; 
            $username = "b5b39d52f466ad"; 
            $password = "eab3317c"; 
            $dbname = "heroku_56366cbee5ccd56";

            try {
                $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                
                $query = "SELECT * FROM users WHERE username=:pusername";
                


                $stmt = $conn->prepare($query);
                $stmt->bindParam('pusername', $pusername);
                $stmt->execute();
                $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

                foreach ($results as $row) {
                    if($ppassword == $row['password']){
                        $id = $row['id'];
                        $token = getAuthToken(255);
                        $_SESSION['auth'] = $token;
                        $_SESSION['authid'] = $id;
                        $updateQuery = "UPDATE users SET auth=:token WHERE id=:id";
                        $updateStmt = $conn->prepare($updateQuery);
                        $updateStmt->bindParam(':token', $token);
                        $updateStmt->bindParam(':id', $id);
                        $updateStmt->execute();

                        header("Location: index.php?tab=overview");
                        exit;
                    }
                    
                }
                header("Location: login.html?err=login");
                exit;
            } catch(PDOException $e) {
                echo "Erreur de connexion à la base de données : " . $e->getMessage();
            }
        }
        else
        {
            header("Location: login.html?err=nopass");
            exit;
        }
    }
    else{
        header("Location: login.html?err=nouser");
        exit;
    }
?>
