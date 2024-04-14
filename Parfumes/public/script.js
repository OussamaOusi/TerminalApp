let fragrances = [];

function populateTable(fragrances) {
    const tbody = document.querySelector('#fragrancesTable tbody');
    tbody.innerHTML = '';

    fragrances.forEach(fragrance => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${fragrance.id}</td>
            <td>${fragrance.name}</td>
            <td>${fragrance.description}</td>
            <td>${fragrance.age}</td>
            <td>${fragrance.releasedate}</td>
            <td>${fragrance.category}</td>
            <td>${fragrance.price}</td>
            <td>${fragrance.season.join(', ')}</td>
            <td><a href="detail.html?id=${fragrance.id}">Details</a></td>
        `;
        tbody.appendChild(row);

        row.addEventListener('click', function () {
            console.log('Doorklikken naar detailpagina voor parfum:', fragrance.name);
        });
    });
}

function filterFragrances() {
    const searchText = document.getElementById("filterInput").value.toLowerCase();
    const filteredFragrances = fragrances.filter(fragrance => fragrance.name.toLowerCase().includes(searchText));
    populateTable(filteredFragrances);
}

document.getElementById("filterInput").addEventListener("input", filterFragrances);

function sortData(column) {
    const isAscending = sortDirection[column] === "asc";
    let sortedFragrances;
    if (column === "releasedate") {
        sortedFragrances = fragrances.sort((a, b) => (isAscending ? new Date(a[column]) - new Date(b[column]) : new Date(b[column]) - new Date(a[column])));
    } else {
        sortedFragrances = fragrances.sort((a, b) => (isAscending ? (a[column] > b[column] ? 1 : -1) : (a[column] < b[column] ? 1 : -1)));
    }
    populateTable(sortedFragrances);
    sortDirection[column] = isAscending ? "desc" : "asc";
}

const sortDirection = {
    id: "asc",
    name: "asc",
    age: "asc",
    releasedate: "asc",
    category: "asc",
    price: "asc",
    season: "asc"
};

document.addEventListener("DOMContentLoaded", function () {
    fetchData();
    const sortById = document.getElementById("sortById");
    const sortByName = document.getElementById("sortByName");
    const sortByAge = document.getElementById("sortAge");
    const sortByReleasedate = document.getElementById("releasedate");
    const sortByCategory = document.getElementById("category");
    const sortByPrice = document.getElementById("price");
    const sortBySes = document.getElementById("sortBySes");

    sortById.addEventListener("click", function () {
        sortData("id");
    });

    sortByName.addEventListener("click", function () {
        sortData("name");
    });

    sortByAge.addEventListener("click", function () {
        sortData("age");
    });

    sortByReleasedate.addEventListener("click", function () {
        sortData("releasedate");
    });

    sortByCategory.addEventListener("click", function () {
        sortData("category");
    });

    sortByPrice.addEventListener("click", function () {
        sortData("price");
    });

    sortBySes.addEventListener("click", function () {
        sortData("season");
    });
});

function fetchData() {
    fetch('https://raw.githubusercontent.com/OussamaOusi/TerminalApp/main/parfum.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            fragrances = data;
            populateTable(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

window.addEventListener('load', fetchData);