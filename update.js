window.addEventListener( 'load', () =>{
    document.getElementById('nom').value= localStorage.getItem("nom") || "";
    document.getElementById('ville').value= localStorage.getItem("ville") || "";
    document.getElementById('prof').value= localStorage.getItem("prof") || "";

})

const enregistrement = document.getElementById('updat')

enregistrement.addEventListener( 'click', () => {
    const nom = document.getElementById("nom").value;
    const ville = document.getElementById("ville").value;
    const prof = document.getElementById("prof").value;

    localStorage.setItem("nom", nom);
    localStorage.setItem("ville", ville);
    localStorage.setItem("prof", prof);

    alert("Enregistrement fait avec succès");

    setTimeout(() => {
        window.location.href = "index.html";
    }, 300);
});