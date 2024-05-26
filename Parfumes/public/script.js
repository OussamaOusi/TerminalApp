document.addEventListener("DOMContentLoaded", function () {
    console.log("Script is geladen en wordt uitgevoerd");

    const table = document.getElementById("fragrancesTable");
    const headers = table.querySelectorAll("th");
    let sortDirection = 1;

    headers.forEach((header, index) => {
        header.addEventListener("click", () => {
            sortTableByColumn(table, index, sortDirection);
            sortDirection = -sortDirection;  // Toggle sort direction
        });
    });

    function sortTableByColumn(table, column, direction) {
        const rows = Array.from(table.querySelectorAll("tbody tr"));
        const sortedRows = rows.sort((a, b) => {
            const aText = a.cells[column].textContent.trim();
            const bText = b.cells[column].textContent.trim();

            if (!isNaN(aText) && !isNaN(bText)) {
                return direction * (parseFloat(aText) - parseFloat(bText));
            }

            return direction * aText.localeCompare(bText);
        });

        while (table.querySelector("tbody").firstChild) {
            table.querySelector("tbody").removeChild(table.querySelector("tbody").firstChild);
        }

        table.querySelector("tbody").append(...sortedRows);
    }

    // Filter functionaliteit
    const filterInput = document.getElementById("filterInput");
    filterInput.addEventListener("keyup", function () {
        const filterValue = filterInput.value.toLowerCase();
        const rows = table.querySelectorAll("tbody tr");

        rows.forEach(row => {
            const cellText = row.cells[1].textContent.toLowerCase();
            if (cellText.includes(filterValue)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
});
