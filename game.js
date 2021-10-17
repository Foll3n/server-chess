class Partie {
    listeCoups = [];

    plateau
    constructor(joueur1, joueur2) {
        this.joueur1 = joueur1;
        this.joueur2 = joueur2;
    }
    addCoup(coup){
        this.listeCoups.push(coup);
    }
    removeListeCoup(){ // un coup = e1:e2
        this.listeCoups = [];
    }
    addPlateau(plateau){
        this.plateau = plateau
    }

}
module.exports = Partie;
