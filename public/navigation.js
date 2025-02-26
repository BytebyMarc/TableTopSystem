document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM vollständig geladen");
    fetch('navigation.html')
        .then(response => {
            console.log("Response erhalten:", response);
            return response.text();
        })
        .then(data => {
            console.log("Navigation geladen:", data);
            document.getElementById('nav-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Fehler beim Laden der Navigation:', error));
});
