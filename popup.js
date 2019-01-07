let submitBtn = document.getElementById('submit-btn')
let issueIdInput = document.getElementById('id-input')
let projectKeyInput = document.getElementById('project-input')
let jiraBaseUrl = "https://miamed.atlassian.net/browse/"


function openNewTab() {
    let url = jiraBaseUrl + projectKeyInput.value + "-" + issueIdInput.value
    chrome.tabs.create({'url': url});
}


// Submit on Button click
submitBtn.onclick = openNewTab;

// Submit on Enter key press
issueIdInput.onkeyup = () => {
    if (event.keyCode === 13) {
        openNewTab();
     }
}



