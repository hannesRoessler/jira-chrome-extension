let submitBtn = document.getElementById('submit-btn')
let issueIdInput = document.getElementById('id-input')
let projectKeySelect = document.getElementById('project-select')
let jiraBaseUrl = "https://miamed.atlassian.net/browse/"


function openNewTab() {
    let url = jiraBaseUrl + projectKeySelect.value + "-" + issueIdInput.value
    chrome.tabs.create({'url': url});
}


// Submit on Button click
submitBtn.onclick = openNewTab;
projectKeySelect.onchange = saveDropDownSelection;
window.onload = loadDropDownPreset;

// Submit on Enter key press
issueIdInput.onkeyup = () => {
    if (event.keyCode === 13) {
        openNewTab();
     }
}

function saveDropDownSelection() {
    chrome.storage.local.set({
        projectKey: projectKeySelect.value
});
}

function loadDropDownPreset() {
    chrome.storage.local.get({
        projectKey: '',
    }, function(items) {
        //Store retrieved options as the selected values in the DOM
        projectKeySelect.value = items.projectKey;
    });
}



