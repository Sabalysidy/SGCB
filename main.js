// Fonction pour enregistrer les données du compte et les transactions dans le localStorage
function sauvegarderDonnees() {
  localStorage.setItem("compteBancaire", JSON.stringify(monCompte));
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Fonction pour charger les données du compte et les transactions depuis le localStorage
function chargerDonnees() {
  var donnees = localStorage.getItem("compteBancaire");
  if (donnees) {
    monCompte = Object.assign(new CompteBancaire(), JSON.parse(donnees));
    updateSolde();
  }

  var transactionsData = localStorage.getItem("transactions");
  if (transactionsData) {
    transactions = JSON.parse(transactionsData);
    updateTransactionList();
  }
}

// Appelez la fonction de chargement lors du chargement de la page
window.addEventListener("load", chargerDonnees);

// Variables pour stocker les transactions
var transactions = [];

// Fonction pour mettre à jour la liste des transactions dans le DOM
function updateTransactionList() {
  var transactionList = document.getElementById("transaction-list");
  transactionList.innerHTML = ""; // Efface la liste actuelle

  transactions.forEach(function (transaction) {
    var listItem = document.createElement("li");
    listItem.textContent = transaction;
    transactionList.appendChild(listItem);
  });
}

// Collez ici le code JavaScript mis à jour
function updateSolde() {
  document.getElementById("solde").textContent = monCompte.solde.toFixed(2);
}

function updateTransactions(transaction) {
  transactions.push(transaction);
  updateTransactionList();
}

function deposer() {
  var montant = parseFloat(document.getElementById("montant").value);
  if (!isNaN(montant) && montant > 0) {
    monCompte.deposer(montant);
    updateSolde();
    updateTransactions("Dépôt de " + montant.toFixed(2) + " FCFA");
    sauvegarderDonnees();
  }
}

function retirer() {
  var montant = parseFloat(document.getElementById("montant").value);
  if (!isNaN(montant) && montant > 0) {
    monCompte.retirer(montant);
    updateSolde();
    updateTransactions("Retrait de " + montant.toFixed(2) + " FCFA");
    sauvegarderDonnees();
  }
}

function demanderTransfert() {
  var destinataire = prompt("Entrez le numéro de compte du destinataire :");
  if (destinataire === null) {
    return;
  }

  var montant = parseFloat(prompt("Entrez le montant à transférer :"));
  if (isNaN(montant) || montant <= 0) {
    alert("Montant invalide. Veuillez entrer un montant valide.");
    return;
  }

  monCompte.transferer(destinataire, montant);
  updateSolde();
  updateTransactions("Transfert de " + montant.toFixed(2) + " FCFA vers le compte " + destinataire);
  sauvegarderDonnees();
}

function CompteBancaire() {
  this.solde = 0;
}

CompteBancaire.prototype.deposer = function (montant) {
  this.solde += montant;
};

CompteBancaire.prototype.retirer = function (montant) {
  if (this.solde >= montant) {
    this.solde -= montant;
  } else {
    alert("Fonds insuffisants pour effectuer le retrait.");
  }
};

CompteBancaire.prototype.transferer = function (destinataire, montant) {
  if (this.solde >= montant) {
    this.solde -= montant;
    destinataire.solde += montant;
  } else {
    alert("Fonds insuffisants pour effectuer le transfert.");
  }
};

var monCompte = new CompteBancaire();
updateSolde();