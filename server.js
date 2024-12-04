/*
------------------
@description 
	Escrever uma descrição.
------------------
@author 
  Héctor Valente, Pedro Soares, Leonardo e Lorhan
------------------
@date 
  22/10/2024
------------------
@routes
	GET/
    /api/pokemon/:id
    /api/proximarodada
    /api/ultimojogo/:email
    /api/resultadopartida
    /api/resultadogeral
	POST/
    /api/usuario
    /api/login
    /api/partida
    /api/resultado
    /api/rodada
	DELETE/
    /api/usuario/:email
	PATCH/
    /api/usuario/:email
    /api/partida
    /api/resultado
    /api/rodada
    /api/partidalimpa
    /api/gravarpartida
------------------
@history
  22/10/2024 - Héctor Valente - Inclusão das rotas ([GET] /api/pokemon, api/pokemon/:id, /api/usuario e /api/usuario/:email);
  03/11/2024 - Héctor Valente - Inclusão das rotas([POST /api/usuario, /api/login], [DELETE /api/usuario/:email], [PATCH api/jogador/:email]);
  03/11/2024 - Héctor Valente - Implementação do verifyToken;
------------------
*/

/*---------------------------------------------------------------------------------------------------------------*/

//Criar o APP Express
const express = require("express");
const app = express();
const fs = require("fs");

//Inicialização do banco de dados SQLite
const dbFile = './.data/db_poketrunfo.db';
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

//INSERT
//db.run("INSERT INTO Pokemon (id, nome, hp, atk, spAtk, def, spDef, speed) VALUES (10, 'Caterpie', 45, 30, 20, 35, 20, 45),(11, 'Metapod', 50, 20, 25, 55, 25, 30),(12, 'Butterfree', 60, 45, 80, 50, 80, 70),(13, 'Weedle', 40, 35, 20, 30, 20, 50),(14, 'Kakuna', 45, 25, 25, 50, 25, 35),(15, 'Beedrill', 65, 90, 45, 40, 80, 75),(16, 'Pidgey', 40, 45, 35, 40, 35, 56),(17, 'Pidgeotto', 63, 60, 50, 55, 50, 71),(18, 'Pidgeot', 83, 80, 70, 75, 70, 101),(19, 'Rattata', 30, 56, 25, 35, 35, 72),(20, 'Raticate', 55, 81, 50, 60, 70, 97),(21, 'Spearow', 40, 60, 31, 30, 31, 70),(22, 'Fearow', 65, 90, 61, 65, 61, 100),(23, 'Ekans', 35, 60, 40, 44, 54, 55),(24, 'Arbok', 60, 95, 65, 69, 79, 80),(25, 'Pikachu', 35, 55, 50, 40, 50, 90),(26, 'Raichu', 60, 90, 90, 55, 80, 110),(27, 'Sandshrew', 50, 75, 20, 85, 30, 40),(28, 'Sandslash', 75, 100, 45, 110, 55, 65),(29, 'Nidoran♀', 55, 47, 40, 52, 40, 41),(30, 'Nidorina', 70, 62, 55, 67, 55, 56),(31, 'Nidoqueen', 90, 92, 75, 87, 85, 76),(32, 'Nidoran♂', 46, 57, 40, 40, 40, 50),(33, 'Nidorino', 61, 72, 55, 57, 55, 65),(34, 'Nidoking', 81, 102, 85, 77, 75, 85),(35, 'Clefairy', 70, 45, 60, 48, 65, 35),(36, 'Clefable', 95, 70, 95, 73, 90, 60),(37, 'Vulpix', 38, 41, 50, 40, 65, 65),(38, 'Ninetales', 73, 76, 81, 75, 100, 100),(39, 'Jigglypuff', 115, 45, 45, 20, 25, 20),(40, 'Wigglytuff', 140, 70, 85, 45, 50, 45),(41, 'Zubat', 40, 45, 30, 35, 40, 55),(42, 'Golbat', 75, 80, 65, 70, 75, 90),(43, 'Oddish', 45, 50, 75, 55, 65, 30),(44, 'Gloom', 60, 65, 85, 70, 75, 40),(45, 'Vileplume', 75, 80, 110, 85, 90, 50),(46, 'Paras', 35, 70, 50, 55, 55, 25),(47, 'Parasect', 60, 95, 70, 80, 80, 30),(48, 'Venonat', 60, 55, 40, 50, 55, 45),(49, 'Venomoth', 70, 65, 90, 60, 75, 90),(50, 'Diglett', 10, 55, 35, 25, 45, 95),(51, 'Dugtrio', 35, 100, 50, 50, 70, 120),(52, 'Meowth', 40, 45, 40, 35, 40, 90),(53, 'Persian', 65, 70, 65, 60, 65, 115),(54, 'Psyduck', 50, 52, 65, 48, 50, 55),(55, 'Golduck', 80, 82, 95, 78, 80, 85),(56, 'Mankey', 40, 80, 35, 35, 45, 70),(57, 'Primeape', 65, 105, 60, 60, 70, 95),(58, 'Growlithe', 55, 70, 50, 45, 50, 60),(59, 'Arcanine', 90, 110, 80, 80, 80, 95),(60, 'Poliwag', 40, 50, 40, 40, 40, 90),(61, 'Poliwhirl', 65, 65, 50, 65, 50, 90),(62, 'Poliwrath', 90, 85, 70, 95, 90, 70),(63, 'Abra', 25, 20, 105, 15, 55, 90),(64, 'Kadabra', 40, 35, 120, 30, 70, 105),(65, 'Alakazam', 55, 50, 135, 45, 85, 120),(66, 'Machop', 70, 80, 35, 50, 35, 35),(67, 'Machoke', 80, 100, 50, 70, 60, 45),(68, 'Machamp', 90, 130, 65, 80, 85, 55),(69, 'Bellsprout', 50, 75, 70, 35, 30, 40),(70, 'Weepinbell', 65, 90, 85, 50, 45, 55),(71, 'Victreebel', 80, 105, 100, 65, 70, 70),(72, 'Tentacool', 40, 40, 50, 35, 100, 70),(73, 'Tentacruel', 80, 70, 80, 65, 120, 100),(74, 'Geodude', 40, 80, 30, 100, 30, 20),(75, 'Graveler', 55, 95, 45, 115, 45, 35),(76, 'Golem', 80, 120, 55, 130, 65, 45),(77, 'Ponyta', 50, 85, 65, 55, 65, 90),(78, 'Rapidash', 65, 100, 80, 70, 80, 105),(79, 'Slowpoke', 90, 65, 40, 65, 40, 15),(80, 'Slowbro', 95, 75, 100, 110, 80, 30),(81, 'Magnemite', 25, 35, 95, 70, 55, 45),(82, 'Magneton', 50, 60, 120, 95, 70, 70),(83, 'Farfetch\d', 52, 90, 58, 55, 62, 60),(84, 'Doduo', 35, 85, 35, 45, 35, 75),(85, 'Dodrio', 60, 110, 60, 70, 60, 100),(86, 'Seel', 65, 45, 45, 55, 70, 45),(87, 'Dewgong', 90, 70, 70, 80, 95, 70),(88, 'Grimer', 80, 80, 40, 50, 50, 25),(89, 'Muk', 105, 105, 65, 75, 100, 50),(90, 'Shellder', 30, 65, 45, 100, 25, 40),(91, 'Cloyster', 50, 95, 85, 180, 45, 70),(92, 'Gastly', 30, 35, 100, 30, 35, 80),(93, 'Haunter', 45, 50, 115, 45, 55, 95),(94, 'Gengar', 60, 65, 130, 60, 75, 110),(95, 'Onix', 35, 45, 30, 160, 45, 70),(96, 'Drowzee', 60, 48, 43, 45, 90, 42),(97, 'Hypno', 85, 73, 73, 70, 115, 67),(98, 'Krabby', 30, 105, 25, 90, 25, 50),(99, 'Kingler', 55, 130, 50, 115, 50, 75),(100, 'Voltorb', 40, 30, 55, 50, 55, 100),(101, 'Electrode', 60, 50, 80, 70, 80, 150),(102, 'Exeggcute', 60, 40, 60, 80, 45, 40),(103, 'Exeggutor', 95, 95, 125, 85, 75, 55),(104, 'Cubone', 50, 50, 40, 95, 50, 35),(105, 'Marowak', 60, 80, 50, 110, 80, 45),(106, 'Hitmonlee', 50, 120, 35, 53, 110, 87),(107, 'Hitmonchan', 50, 105, 35, 79, 110, 76),(108, 'Lickitung', 90, 55, 60, 75, 75, 30),(109, 'Koffing', 40, 65, 60, 95, 45, 35),(110, 'Weezing', 65, 90, 85, 120, 70, 60),(111, 'Rhyhorn', 80, 85, 30, 95, 30, 25),(112, 'Rhydon', 105, 130, 45, 120, 45, 40),(113, 'Chansey', 250, 5, 35, 5, 105, 50),(114, 'Tangela', 65, 55, 100, 115, 40, 60),(115, 'Kangaskhan', 105, 95, 40, 80, 80, 90),(116, 'Horsea', 30, 40, 70, 70, 25, 60),(117, 'Seadra', 55, 65, 95, 95, 45, 85),(118, 'Goldeen', 45, 67, 35, 60, 50, 63),(119, 'Seaking', 80, 92, 65, 65, 80, 68),(120, 'Staryu', 30, 45, 70, 55, 55, 85),(121, 'Starmie', 60, 75, 100, 85, 85, 115),(122, 'Mr. Mime', 40, 45, 100, 65, 120, 90),(123, 'Scyther', 70, 110, 55, 80, 80, 105),(124, 'Jynx', 65, 50, 115, 35, 95, 95),(125, 'Electabuzz', 65, 83, 95, 57, 85, 105),(126, 'Magmar', 65, 95, 100, 57, 85, 93),(127, 'Pinsir', 65, 125, 55, 100, 70, 85),(128, 'Tauros', 75, 100, 40, 95, 70, 110),(129, 'Magikarp', 20, 10, 15, 55, 20, 80),(130, 'Gyarados', 95, 125, 60, 79, 100, 81),(131, 'Lapras', 130, 85, 85, 80, 95, 60),(132, 'Ditto', 48, 48, 48, 48, 48, 48),(133, 'Eevee', 55, 55, 45, 50, 65, 55),(134, 'Vaporeon', 130, 65, 110, 60, 95, 65),(135, 'Jolteon', 65, 65, 110, 60, 95, 130),(136, 'Flareon', 65, 130, 95, 60, 110, 65),(137, 'Porygon', 65, 60, 85, 70, 75, 40),(138, 'Omanyte', 35, 40, 90, 100, 55, 35),(139, 'Omastar', 70, 60, 115, 125, 70, 55),(140, 'Kabuto', 30, 80, 55, 90, 45, 55),(141, 'Kabutops', 60, 115, 65, 105, 70, 80),(142, 'Aerodactyl', 80, 105, 60, 65, 75, 130),(143, 'Snorlax', 160, 110, 65, 65, 110, 30),(144, 'Articuno', 90, 85, 95, 100, 125, 85),(145, 'Zapdos', 90, 90, 125, 85, 90, 100),(146, 'Moltres', 90, 100, 125, 90, 85, 90),(147, 'Dratini', 41, 64, 50, 45, 50, 50),(148, 'Dragonair', 61, 84, 70, 65, 70, 70),(149, 'Dragonite', 91, 134, 100, 95, 100, 80),(150, 'Mewtwo', 999, 999, 999, 999, 999, 999),(151, 'Mew', 100, 100, 100, 100, 100, 100)");
//db.run("INSERT INTO Pokemon (id, nome, hp, atk, spAtk, def, spDef, speed) VALUES (1, 'Bulbasaur', 45, 49, 65, 49, 65, 45),(2, 'Ivysaur', 60, 62, 80, 63, 80, 60),(3, 'Venusaur', 80, 82, 100, 83, 100, 80),(4, 'Charmander', 39, 52, 60, 43, 50, 65),(5, 'Charmeleon', 58, 64, 80, 58, 65, 80),(6, 'Charizard', 78, 84, 109, 78, 85, 100),(7, 'Squirtle', 44, 48, 50, 65, 64, 43),(8, 'Wartortle', 59, 63, 65, 80, 80, 58),(9, 'Blastoise', 79, 83, 85, 100, 105, 78)");
//DELETE
//db.run("DELETE FROM Partida");
//db.run("DELETE FROM Resultado");
//db.run("DELETE FROM Rodada");
//db.run("DELETE FROM Usuario");
//DROP TABLE
//db.run("DROP TABLE Pokemon")
//db.run("DROP TABLE Usuario")
//db.run("DROP TABLE Partida")
//db.run("DROP TABLE Resultado")
//db.run("DROP TABLE Rodada")
//CREATE TABLE
//db.run("CREATE TABLE Pokemon (id INT NOT NULL PRIMARY KEY,nome VARCHAR(100) NOT NULL,hp INT NOT NULL,atk INT NOT NULL,spAtk INT NOT NULL,def INT NOT NULL,spDef INT NOT NULL,speed INT NOT NULL)");
//db.run("CREATE TABLE Usuario (email VARCHAR(100) NOT NULL PRIMARY KEY,nome VARCHAR(100) NOT NULL,senha VARCHAR(10) NOT NULL)");
//db.run("CREATE TABLE Partida (id INTEGER PRIMARY KEY AUTOINCREMENT,email VARCHAR(100) NOT NULL,player VARCHAR(40) NOT NULL,cpu VARCHAR(40) NOT NULL,resultado INT)");
//db.run("CREATE TABLE Resultado (id INTEGER PRIMARY KEY AUTOINCREMENT,id_partida INT NOT NULL, id_pokemon INT NOT NULL, player INT NOT NULL, rodada INT, usado INT, resultado INT)");
//db.run("CREATE TABLE Rodada (id INTEGER PRIMARY KEY AUTOINCREMENT, id_partida INT NOT NULL, rodada INT NOT NULL, player_begin INT NOT NULL)");

//Chamando jwt, bcryptjs e body-parser
const jwt = require("jsonwebtoken");
const bcryptjs = require('bcryptjs');
const bodyParser = require('body-parser');

//Vamos tratar quando o visitante acessar o "/" (página principal)
app.get("/", function(request, response){
  response.sendFile(__dirname + "/index.html");
});

app.use(express.json());

/*---------------------------------------------------------------------------------------------------------------*/

/*INÍCIO: LOGIN E TOKEN*/

// Função para gerar token JWT
const generateToken = (user) => {
  return jwt.sign({ email: user.email, senha: user.senha }, 'seuSegredoJWT', { expiresIn: '1h' });
};

// Rota POST para login de Usuário
app.post('/api/login', (request, response) => {
  const { email, senha } = request.body;

  // Busca o usuário no banco de dados
  db.get('SELECT * FROM Usuario WHERE email = ?', [email], (err, user) => {
    if (err) {
      return response.status(500).json({ error: 'Erro no banco de dados.' });
    }
    if (!user) {
      return response.status(404).json({ error: 'Usuário não encontrado.' });
    }
    
    console.log(senha+' '+user.senha);
    //aqui vai entrar criptografia depois..
    if (senha == user.senha) {
      const token = generateToken(user);
      return response.json({message: "Login bem-sucedido!", nome: user.nome, email: user.email, token});
    } else {
      return response.status(401).json({error: "Senha inválida."});
    }
  });
});
  
// Verificar token!
const verifyToken = (request, response, next) => {
  const token = request.headers['x-access-token'];
  if (!token) { //undefined
    return response.status(403).json({error: 'Nenhum token foi fornecido.'});
  }
  
  jwt.verify(token, 'seuSegredoJWT', (error, decoded) => {
    if (error) {
      return response.status(500).json({error: 'Falha ao autenticar o token.'});
    }
    
    request.email = decoded.email;
    request.senha = decoded.senha;
    next();
  });
};

/*FIM: LOGIN E TOKEN*/

/*---------------------------------------------------------------------------------------------------------------*/

/*INÍCIO: ENDPOINTS*/

//Rota GET para retornar todas as Rodadas
app.get("/api/rodada", function(request, response){
  db.all("SELECT * FROM Rodada", (error, linhas) =>{
    response.setHeader('content-type', 'text/json');
    return response.send(JSON.stringify(linhas));
  })
});

//Rota GET para retornar todos as Partidas
app.get("/api/partida", function(request, response){
  db.all("SELECT * FROM Partida", (error, linhas) =>{
    response.setHeader('content-type', 'text/json');
    return response.send(JSON.stringify(linhas));
  })
});

//Rota GET para retornar todos os Resultados
app.get("/api/resultado", function(request, response){
  db.all("SELECT * FROM Resultado", (error, linhas) =>{
    response.setHeader('content-type', 'text/json');
    return response.send(JSON.stringify(linhas));
  })
});

//Rota GET para retornar todos os Pokemon
app.get("/api/pokemon", function(request, response){
  db.all("SELECT * FROM Pokemon", (error, linhas) =>{
    response.setHeader('content-type', 'text/json');
    return response.send(JSON.stringify(linhas));
  })
});

// Rota GET para retornar um único Pokemon, passando o id do mesmo na URL
app.get("/api/pokemon/:id", verifyToken, function(request, response) {
  const id = parseInt(request.params.id);
  const sql = "SELECT * FROM Pokemon WHERE id = ?";
  db.get(sql, [id], function(error, linha) {
    if (error) {
      return response.status(500).send(error);      
    } else {
      console.log(linha);
      if (!linha) {
        return response.status(404).send("Pokemon não encontrado"); 
      } else {
        response.setHeader('content-type', 'application/json');
        return response.send(JSON.stringify(linha));
      }
    }
  });
});

//Rota GET para retornar todos os Usuários
app.get("/api/usuario", function(request, response){
  db.all("SELECT * FROM Usuario", (error, linhas) =>{
    response.setHeader('content-type', 'text/json');
    return response.send(JSON.stringify(linhas));
  })
});

// Rota GET para retornar um único Usuário, passando o email do mesmo na URL
app.get("/api/usuario/:email", verifyToken, function(request, response) {
  const email = request.params.email;
  const sql = "SELECT * FROM Usuario WHERE email = ?";
  db.get(sql, [email], function(error, linha) {
    if (error) {
      return response.status(500).send(error);      
    } else {
      console.log(linha);
      if (!linha) {
        return response.status(404).send("Usuário não encontrado"); 
      } else {
        response.setHeader('content-type', 'application/json');
        return response.send(JSON.stringify(linha));
      }
    }
  });
});

//Rota GET para retornar último jogo
app.get("/api/ultimojogo/:email", verifyToken, function(request, response){
  //const email = request.params.email;
  db.get("SELECT MAX(id) id FROM Partida WHERE email = ? and resultado IS NULL", request.params.email, function(error, linha) {
    if (error) {
      return response.status(500).send(error);      
    } else {
      console.log(linha);
      if (!linha) {
        return response.status(404).send("Nenhum jogo em aberto"); 
      } else {
        response.setHeader('content-type', 'application/json');
        return response.send(JSON.stringify(linha));
      }
    }
  });
});

//Rota GET para retornar o resultado da partida
app.get("/api/resultadopartida", verifyToken, function(request, response){
  const sql = "SELECT "+
                "COUNT(CASE WHEN usado = 1 AND resultado = 1 AND player = 1 THEN 1 END) AS Player, " +
                "COUNT(CASE WHEN usado = 1 AND resultado = 2 AND player = 1 THEN 1 END) AS CPU, " +
                "COUNT(CASE WHEN usado = 1 AND resultado = 3 AND player = 1 THEN 1 END) AS Empate " +
              "FROM Resultado " +
              "WHERE id_partida = ?";
  db.get(sql, request.body.id_partida, function(error, linha) {
    if (error) {
      return response.status(500).send(error);      
    } else {
      console.log(linha);
      if (!linha) {
        return response.status(404).send("Partida não encontrada"); 
      } else {
        response.setHeader('content-type', 'application/json');
        return response.send(JSON.stringify(linha));
      }
    }
  });
});

//Rota GET para retornar o resultado geral
app.get("/api/resultadogeral", verifyToken, function(request, response){
  const sql = "SELECT "+
                "COUNT(CASE WHEN resultado = 1 THEN 1 END) AS Vitoria, "+
                "COUNT(CASE WHEN resultado = 3 THEN 1 END) AS Empate, "+
                "COUNT(CASE WHEN resultado = 2 THEN 1 END) AS Derrota, "+
                "COUNT(CASE WHEN resultado = 4 THEN 1 END) AS Abandonada "+
              "FROM Partida "+
              "WHERE email = ?";
  db.get(sql, request.body.email, function(error, linha) {
    if (error) {
      return response.status(500).send(error);      
    } else {
      console.log(linha);
      if (!linha) {
        return response.status(404).send("Partida não encontrada"); 
      } else {
        response.setHeader('content-type', 'application/json');
        return response.send(JSON.stringify(linha));
      }
    }
  });
});


//Rota GET para retornar próxima rodada
app.get("/api/proximarodada", verifyToken, function(request, response){
  const sql = "SELECT _Partida.id AS id_partida, _Resultado.id_pokemon AS id, _Resultado.player, _Resultado.usado, _Rodada.rodada, _Rodada.player_begin, " +
              "_Pokemon.nome, _Pokemon.hp, _Pokemon.atk, _Pokemon.spAtk, _Pokemon.def, _Pokemon.spDef, _Pokemon.speed " +
              "FROM Partida _Partida " +
                "INNER JOIN Resultado _Resultado ON _Partida.id = _Resultado.id_partida " +
                "INNER JOIN Rodada _Rodada ON _Partida.id = _Rodada.id_partida " +
                "INNER JOIN Pokemon _Pokemon ON _Resultado.id_pokemon = _Pokemon.id " +
              "WHERE _Partida.id = ? AND _Partida.email = ?";  
  db.all(sql, request.body.id_partida, request.body.email, (error, linhas) =>{
    if (error) {
      console.error("Erro GET proximarodada:", error.message);
      response.status(500).send({ error: "Erro ao buscar dados no banco de dados.", detalhes: error.message });
      return;
    }
    response.setHeader('content-type', 'text/json');
    return response.send(linhas);
  })
});

//Rota POST para criar um Usuário
app.post("/api/usuario", function(request, response){
  db.run("INSERT INTO Usuario (email, nome, senha) VALUES(?,?,?)", request.body.email, request.body.nome, request.body.senha, function(error){
    if (error){
      return response.status(500).send(error);
    } else{
      return response.status(201).json({email: request.body.email, nome: request.body.nome, senha: request.body.senha});
    }
  });
});

//Rota POST para criar uma Partida
app.post("/api/partida", verifyToken, function(request, response){
  const email = request.body.email;
  const player = JSON.stringify(request.body.player); // Serializa o array
  const cpu = JSON.stringify(request.body.cpu); // Serializa o array
  db.run("INSERT INTO Partida (email, player, cpu) VALUES(?,?,?)", [email, player, cpu], function(error){
    if (error){
      //console.error("Erro ao inserir na tabela Partida:", error.message);
      return response.status(500).send(error);
    } else{
      return response.status(201).json({id: this.lastID, player: JSON.parse(player), cpu: JSON.parse(cpu)});
    }
  });
});

//Rota POST para criar cadastro de Resultado
app.post("/api/resultado", verifyToken, function(request, response){
  db.run("INSERT INTO Resultado (id_partida, id_pokemon, player, usado) VALUES(?,?,?,?)", request.body.id_partida, request.body.id_pokemon, request.body.player, request.body.usado, function(error){
    if (error){
      //console.error("Erro ao inserir na tabela Partida:", error.message);
      return response.status(500).send(error);
    } else{
      return response.status(201).json({});
    }
  });
});

//Rota POST para criar cadastro de Rodada
app.post("/api/rodada", verifyToken, function(request, response){
  db.run("INSERT INTO Rodada (id_partida, rodada, player_begin) VALUES(?,?,?)", request.body.id_partida, request.body.rodada, request.body.player_begin, function(error){
    if (error){
      console.error("Erro ao inserir na tabela Partida:", error.message);
      return response.status(500).send(error);
    } else{
      return response.status(201).json({rodada: request.body.rodada, player_begin: request.body.player_begin});
    }
  });
});

//Rota DEL para deletar um Usuário
  app.delete("/api/usuario", verifyToken, function(request, response) {
  db.run("DELETE FROM Usuario WHERE email = ? AND senha = ?", request.body.email, request.body.senha, function(error){
  if (error) {
      return response.status(500).send("Erro no servidor");
  }else{
      if (this.changes === 0){
        return response.status(404).send("Usuário não encontrado");
      }else{
        return response.status(204).send();
      }
  }
  });
});

//Rota PATCH para alterar a tabela Usuário
app.patch("/api/usuario/:email", verifyToken, function(request, response) {
  const email = request.params.email;
  
  // Passando TUDO, nome, preco, estoque..
  let set = "";
  let valores = [];
  
  // Se vai ter nome
  console.log(request.body.senha);
  if (request.body.senha != undefined){
    set = "senha=?";
    valores.push(request.body.senha);    
  }
  
  const sql = "UPDATE Usuario SET "+set+" WHERE email=?";
  valores.push(email);
  console.log(sql);
  
  db.run(sql, valores, function(error) {
    if (error) {
      return response.status(500).send("Erro interno do servidor.");
    } else {
      if (this.changes === 0) {
        return response.status(404).send("Usuário não encontrado.");
      } else {
        return response.status(200).send();
      }
    }
  });
});

//Rota PATCH para gravar o resultado na tabela Partida
app.patch("/api/gravarpartida", verifyToken, function(request, response) { 
  db.run("UPDATE Partida SET resultado = ? WHERE id = ? AND (resultado ISNULL OR resultado = '')", request.body.resultado, request.body.id, function(error){
    if (error) {
      return response.status(500).send("Erro interno do servidor.");
    } else {
      if (this.changes === 0) {
        return response.status(404).send("Partida não encontrada.");
      } else {
        return response.status(200).send();
      }
    }
  });
});

//Rota PATCH para LIMPAR campo resultado da tabela Partida
app.patch("/api/partidalimpa", verifyToken, function(request, response) { 
  db.run("UPDATE Partida SET resultado = 4 where email = ? AND (resultado ISNULL OR resultado = '')", request.body.email, function(error){
    if (error) {
      return response.status(500).send("Erro interno do servidor.");
    } else {
      if (this.changes === 0) {
        return response.status(404).send("Partida não encontrada.");
      } else {
        return response.status(200).send();
      }
    }
  });
});

//Rota PATCH para alterar a tabela Partida
app.patch("/api/partida", verifyToken, function(request, response) { 
  db.run("UPDATE Partida SET resultado = ? WHERE id = ?", request.body.resultado, request.body.id, function(error){
    if (error) {
      console.error("Erro ao inserir na tabela Partida:", error.message);
      return response.status(500).send("Erro interno do servidor.");
    } else {
      if (this.changes === 0) {
        return response.status(404).send("Partida não encontrada.");
      } else {
        return response.status(200).send();
      }
    }
  });
});

//Rota PATCH para alterar a tabela Resultado
app.patch("/api/resultado", verifyToken, function(request, response) { 
  db.run("UPDATE Resultado SET rodada = ? , usado = ? , resultado = ? WHERE id_partida = ? AND id_pokemon = ?", request.body.rodada, request.body.usado,request.body.resultado, request.body.id_partida, request.body.id_pokemon, function(error){
    if (error) {
      console.error("Erro ao inserir na tabela Resultado:", error.message);
      return response.status(500).send("Erro interno do servidor.");
    } else {
      if (this.changes === 0) {
        return response.status(404).send("Partida não encontrada.");
      } else {
        return response.status(200).send();
      }
    }
  });
});

//Rota PATCH para alterar a tabela Rodada
app.patch("/api/rodada", verifyToken, function(request, response) { 
  db.run("UPDATE Rodada SET rodada = ? , player_begin = ? WHERE id_partida = ?", request.body.rodada, request.body.player_begin, request.body.id_partida, function(error){
    if (error) {
      console.error("Erro ao inserir na tabela Rodada:", error.message);
      return response.status(500).send("Erro interno do servidor.");
    } else {
      if (this.changes === 0) {
        return response.status(404).send("Partida não encontrada.");
      } else {
        return response.status(200).send();
      }
    }
  });
});

/*FIM: ENDPOINTS*/

/*---------------------------------------------------------------------------------------------------------------*/

//Listener
const listener = app.listen(process.env.PORT, function(){
  console.log("Status_Run: " + listener.address().port);
});