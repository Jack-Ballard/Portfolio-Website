document.addEventListener("DOMContentLoaded", () => {
    const navigation = document.getElementById("navigation");

    fetch(navigation.dataset.source)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            navigation.innerHTML = data;
        })
        .catch(error => {
            console.error("Could not load navigation:", error);
        });
});
