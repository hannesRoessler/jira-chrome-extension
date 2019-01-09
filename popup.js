let submitBtn = document.getElementById('submit-btn')
let addProjBtn = document.getElementById('addproject-btn')
let addProjKeyInput = document.getElementById('addProjectKey-input')
let addProjKeyBtn = document.getElementById('addProjectKey-btn')
let modal = document.getElementById('modal')
let modalBackground = document.getElementById('modal-background')
let issueIdInput = document.getElementById('id-input')
let projectKeySelect = document.getElementById('project-select')
let jiraBaseUrl = "https://miamed.atlassian.net/browse/"
let projects = []


function openNewTab() {
    let url = jiraBaseUrl + projectKeySelect.value + "-" + issueIdInput.value
    chrome.tabs.create({'url': url});
}


// Submit on Button click
addProjBtn.onclick = openModal;
addProjKeyBtn.onclick = addProjectKey;
submitBtn.onclick = openNewTab;
//projectKeySelect.onchange = saveDropDownSelection;
window.onload = useStoredOptionsForDisplayInDOM;

// Submit on Enter key press
issueIdInput.onkeyup = () => {
    if (event.keyCode === 13) {
        openNewTab();
     }
}

/*function saveDropDownSelection(key) {
    chrome.storage.local.set({
        projectKey: projectKeySelect.value
});
}*/

function useStoredOptionsForDisplayInDOM() {
    chrome.storage.local.get({
        projectKeys: '',
    }, function(items) {
        //Store retrieved options as the selected values in the DOM
        projectKeySelect.innerHTML = "";
        items.projectKeys.map(key => {
        projectKeySelect.innerHTML += `<option>${key}</option>`;
    })
    });
}

function addProjectKey(){
 //  projects.push(addProjKeyInput.value)
  // alert(projects)
   chrome.storage.local.set({
       // TODO - push addProjKeyInput.value directly to storage object instead of using projects variable
    projectKeys: '[]'
    projectKeys.push(addProjKeyInput.value)
   })
    closeModal()
    useStoredOptionsForDisplayInDOM()
}


function openModal(){
    modal.style.display = "block"
}
function closeModal(){
    modal.style.display = "none"
}



//        <option value="NEXT">NEXT</option>
