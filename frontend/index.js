import { backend } from "declarations/backend";

// Function to show/hide loading spinner
const toggleLoading = (show) => {
    document.getElementById('loading').classList.toggle('d-none', !show);
};

// Function to load and display all taxpayers
const loadTaxPayers = async () => {
    try {
        toggleLoading(true);
        const taxpayers = await backend.getAllTaxPayers();
        const tbody = document.getElementById('taxpayersList');
        tbody.innerHTML = taxpayers.map(tp => `
            <tr>
                <td>${tp.tid}</td>
                <td>${tp.firstName}</td>
                <td>${tp.lastName}</td>
                <td>${tp.address}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading taxpayers:', error);
        alert('Failed to load taxpayers');
    } finally {
        toggleLoading(false);
    }
};

// Handle form submission for adding new taxpayer
document.getElementById('addTaxPayerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const taxpayer = {
        tid: document.getElementById('tid').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address: document.getElementById('address').value
    };

    try {
        toggleLoading(true);
        const success = await backend.addTaxPayer(taxpayer);
        if (success) {
            alert('TaxPayer added successfully');
            e.target.reset();
            loadTaxPayers();
        } else {
            alert('TaxPayer with this TID already exists');
        }
    } catch (error) {
        console.error('Error adding taxpayer:', error);
        alert('Failed to add taxpayer');
    } finally {
        toggleLoading(false);
    }
});

// Handle search form submission
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const tid = document.getElementById('searchTid').value;
    const resultDiv = document.getElementById('searchResult');

    try {
        toggleLoading(true);
        const taxpayer = await backend.searchByTID(tid);
        
        if (taxpayer) {
            resultDiv.innerHTML = `
                <div class="alert alert-success">
                    <h5>TaxPayer Found:</h5>
                    <p>TID: ${taxpayer.tid}</p>
                    <p>Name: ${taxpayer.firstName} ${taxpayer.lastName}</p>
                    <p>Address: ${taxpayer.address}</p>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="alert alert-warning">
                    No taxpayer found with TID: ${tid}
                </div>
            `;
        }
    } catch (error) {
        console.error('Error searching taxpayer:', error);
        resultDiv.innerHTML = `
            <div class="alert alert-danger">
                Error searching for taxpayer
            </div>
        `;
    } finally {
        toggleLoading(false);
    }
});

// Load taxpayers when page loads
window.addEventListener('load', loadTaxPayers);
