function updateTableHTML(id, myArray) {
    const tableBody = document.getElementById(id);

    // Reset the table
    tableBody.innerHTML = "";

    // Build the new table
    myArray.forEach(function (row) {
        const newRow = document.createElement("tr");
        tableBody.appendChild(newRow);

        if (row instanceof Array) {
            row.forEach(function (cell) {
                const newCell = document.createElement("td");
                newCell.textContent = cell;
                newRow.appendChild(newCell);

            });
        } else {
            const newCell = document.createElement("td");
            newCell.textContent = row;
            newRow.appendChild(newCell);

            const checkboxCell = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox"
            checkbox.className = "check"
            checkbox.name = row
            checkbox.id = btoa(row).slice(0, -2);
            checkboxCell.appendChild(checkbox)

            newRow.appendChild(checkboxCell)
        }
    });
}
async function saveOptions(e) {
    let result = await browser.storage.sync.get();
    const checklist = result.checklist ?? [];
    const checks = Object.fromEntries(checklist.map(c => [c, document.querySelector("#" + btoa(c).slice(0, -2)).checked]));

    browser.storage.sync.set({
        email: document.querySelector("#email").value,
        name: document.querySelector("#name").value,
        bday: document.querySelector("#bday").value,
        address: document.querySelector("#address").value,
        checks: checks
    });

    e.preventDefault();
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.querySelector("#email").value = result.email;
        document.querySelector("#name").value = result.name;
        document.querySelector("#bday").value = result.bday;
        document.querySelector("#address").value = result.address;

        const checklist = result.checklist ?? [];
        updateTableHTML("checklist", checklist)
        checklist.forEach(c => document.querySelector("#" + btoa(c).slice(0, -2)).checked = result.checks?.[c])
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let getting = browser.storage.sync.get();
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

