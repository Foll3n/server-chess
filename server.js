const Partie = require("./game");
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
    cors: {
        origins: ['http://localhost:4200']
    }
});







app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');//res.sendFile(__dirname + '/index.html');
});

let listeUsersConnectes = [];
let listeUserEnAttente = [];
let listeParties = [];


io.on('connection', (socket) => {
    console.log('utilisateur '+  socket.id + ' connecte');
    addUtilisateur(socket.id);


    socket.on('demandeJeu', (msg) => {
        console.log('le serveur a recu : ' + msg);
        addUtilisateurEnAttente(socket.id);
        io.to(socket.id).emit('demandeJeu', 'demande de jeu prise en compte');
    });

    socket.on('jouerCase', (datas) => {

        console.log('le serveur a recu : ' + datas.toString());
        jouer(socket.id, datas.caseAct, datas.plateau)
    });



    socket.on('disconnect', () => {
        console.log('utilisateur '+  socket.id + ' déconnecté');
    });
});




server.listen(3000, () => {
    console.log('le serveur ecoute le port 3000');
});


function addUtilisateur(id){
    if (!listeUsersConnectes.find(i=> i == id)) listeUsersConnectes.push(id);
}

function addUtilisateurEnAttente(id){
    console.log("appel fct");
    let a = ''
    if (listeUserEnAttente.length % 2 == 1 && !listeUserEnAttente.find(i => i == id)){
        let partie = new Partie(id, listeUserEnAttente.pop());
        listeParties.push(partie);
        io.to(partie.joueur1).emit('lancerJeu', ["joueur1", "true"]);
        io.to(partie.joueur2).emit('lancerJeu', ["joueur2", "false"]);
    }
    else{
        if (!listeUserEnAttente.find(i => i == id)) listeUserEnAttente.push(id);
    }
    console.log("parties en cours" + listeParties);
}

function jouer(id, caseAJouer, plateau){
    console.log("plateau", plateau)
    for (p of listeParties){
        if (p.joueur1 == id){
            console.log("envoie au joueur 2")

            io.to(p.joueur2).emit('jouer', caseAJouer);
        }
        if (p.joueur2 == id){
            console.log("envoie au joueur 1")
            io.to(p.joueur1).emit('jouer', caseAJouer);
        }
        p.listeCoups.push(caseAJouer);
        p.plateau = plateau;
    }
}
