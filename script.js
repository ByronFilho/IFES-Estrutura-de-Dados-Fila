
document.addEventListener('DOMContentLoaded', () => {

    
    
    const addPackageBtn = document.getElementById('add-package-btn');
    const deliverPackageBtn = document.getElementById('deliver-package-btn');
    const queueListDiv = document.getElementById('queue-list');
    const historyListDiv = document.getElementById('history-list');
    const queueCountSpan = document.getElementById('queue-count');
    const statusMessageDiv = document.getElementById('status-message');

    
    let packageQueue = [];
    let deliveryHistory = [];

    

    /**
     * Busca um usuário fictício na API e o formata como um objeto de pacote.
     * @returns {Promise<Object>} Um objeto representando o pacote.
     */
    const fetchPackageData = async () => {
        try {
            const response = await fetch('https://randomuser.me/api/?nat=br');
            if (!response.ok) throw new Error('Falha na resposta da rede');
            const data = await response.json();
            const user = data.results[0];

            return {
                id: user.login.uuid,
                recipient: `${user.name.first} ${user.name.last}`,
                address: `${user.location.street.name}, ${user.location.street.number}`,
                city: user.location.city,
                country: user.location.country,
            };
        } catch (error) {
            console.error("Erro ao buscar dados do pacote:", error);
            displayStatusMessage("Não foi possível buscar um novo pacote.", "error");
            return null;
        }
    };

    /**
     * Função central.
     */
    const updateUI = () => {
        
        queueCountSpan.textContent = packageQueue.length;

        
        deliverPackageBtn.disabled = packageQueue.length === 0;

        
        renderList(queueListDiv, packageQueue, "A fila de entregas está vazia.");

       
        renderList(historyListDiv, deliveryHistory, "Nenhum pacote foi entregue ainda.");
    };

    /**
     * Renderiza uma lista de pacotes em um elemento HTML específico.
     * @param {HTMLElement} element - O elemento onde a lista será renderizada.
     * @param {Array<Object>} items - O array de pacotes.
     * @param {string} emptyMessage - A mensagem a ser exibida se a lista estiver vazia.
     */
    const renderList = (element, items, emptyMessage) => {
        element.innerHTML = ''; 
        if (items.length === 0) {
            element.innerHTML = `<p class="empty-message">${emptyMessage}</p>`;
            return;
        }

        items.forEach(pkg => {
            const packageItem = document.createElement('div');
            packageItem.className = 'package-item';
           
            packageItem.style.backgroundColor = 'var(--container-bg)';
            packageItem.style.padding = '1rem';
            packageItem.style.border = '1px solid var(--border-color)';
            packageItem.style.borderRadius = '5px';
            packageItem.style.marginBottom = '0.5rem';

            packageItem.innerHTML = `
                <p style="font-weight: bold;">${pkg.recipient}</p>
                <p style="font-size: 0.9em; color: #555;">${pkg.address} - ${pkg.city}, ${pkg.country}</p>
            `;
            element.appendChild(packageItem);
        });
    };

    /**
     * Exibe uma mensagem de status na tela.
     * @param {string} message - A mensagem a ser exibida.
     * @param {string} type - 'success' ou 'error' para estilização.
     */
    const displayStatusMessage = (message, type = 'success') => {
        statusMessageDiv.textContent = message;
        
        statusMessageDiv.style.color = (type === 'success') ? '#28a745' : '#dc3545';

        setTimeout(() => {
            statusMessageDiv.textContent = '';
            statusMessageDiv.style.color = ''; 
        }, 3000);
    };



    const handleAddPackage = async () => {
        const newPackage = await fetchPackageData();
        if (newPackage) {
            packageQueue.push(newPackage); 
            displayStatusMessage(`Pacote para ${newPackage.recipient} adicionado à fila!`, 'success');
            updateUI();
        }
    };

    const handleDeliverPackage = () => {
        if (packageQueue.length === 0) {
            displayStatusMessage("Não há pacotes para entregar.", "error");
            return;
        }

        const deliveredPackage = packageQueue.shift(); 
        deliveryHistory.unshift(deliveredPackage); 

        displayStatusMessage(`Pacote para ${deliveredPackage.recipient} foi entregue com sucesso!`, 'success');
        updateUI();
    };

    -

    addPackageBtn.addEventListener('click', handleAddPackage);
    deliverPackageBtn.addEventListener('click', handleDeliverPackage);

    updateUI(); 
});