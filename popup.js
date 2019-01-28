let submitBtn = document.getElementById('submit-btn')
let addProjBtn = document.getElementById('addproject-btn')
let urlBtn = document.getElementById('url-btn')
let addProjKeyInput = document.getElementById('addProjectKey-input')
let addProjKeyBtn = document.getElementById('addProjectKey-btn')
let cancelBtn = document.getElementById('cancel-btn')
let keysModal = document.getElementById('keys-modal')
let urlModal = document.getElementById('url-modal')
let keyList = document.getElementById('keyList')
let modalBackground = document.getElementById('modal-background')
let issueIdInput = document.getElementById('id-input')
let companyInput = document.getElementById('company-input')
let urlComposition = document.getElementById('url-composition')
let projectKeySelect = document.getElementById('project-select')
let saveJiraUrlBtn = document.getElementById('save-url-btn')
//let deleteBtn = document.getElementById('delete-btn')
let jiraBaseUrl = document.getElementById('jira-url-input')
let jiraUrl = ""
let storedKeys = []

addProjBtn.addEventListener('click', () => controlModalDisplayStyle("block", keysModal))
urlBtn.addEventListener('click', () => controlModalDisplayStyle("block", urlModal))
saveJiraUrlBtn.addEventListener('click', () => {
    storeJiraUrlElements(companyInput.value, jiraBaseUrl.value)
    controlModalDisplayStyle("none", urlModal)
})
cancelBtn.addEventListener('click', () => {
    controlModalDisplayStyle("none", keysModal)
    resetInputValue(addProjKeyInput);
})
addProjKeyBtn.onclick = addProjectKey;
submitBtn.onclick = openNewTab;
window.onload = () => {
    useStoredOptionsForDisplayInDOM()
    updateJiraUrlInUrlCompositionDom()
}
projectKeySelect.onchange = makeDropDownSelectionDefault;
// Submit on Enter key press
issueIdInput.onkeyup = () => {
    if (event.keyCode === 13) {
        openNewTab();
     }
}
companyInput.addEventListener('keyup',function(){
    updateJiraUrlInUrlCompositionDom()
});
jiraBaseUrl.addEventListener('keyup',function(){jiraUrl()});



function openNewTab() {
    let url = generateIssueUrl()
    chrome.tabs.create({'url': url});
}

// Puts latest selection to top to make it default one for page reloads
function makeDropDownSelectionDefault(){
    // TODO: make general function that takes param and makes it first array element
    storedKeys = storedKeys.filter(item => item !== projectKeySelect.value);
    storedKeys.unshift(projectKeySelect.value);
    storeProjectKeys(storedKeys)
}

function generateIssueUrl() {
    return jiraBaseUrl + projectKeySelect.value + "-" + issueIdInput.value;
}

function useStoredOptionsForDisplayInDOM() {
    chrome.storage.local.get({
        // TODO: build solution to create key if not existent, build general function
        // TODO: remove update-DOM logic from loadKeys from chrome storage
        projectKeys: '',
    }, function(items) {
        //Store retrieved options as the selected values in the DOM
        storedKeys = items.projectKeys
        projectKeySelect.innerHTML = "";
        keyList.innerHTML = "";
        items.projectKeys.map(key => {
        projectKeySelect.innerHTML += `<option>${key}</option>`
        keyList.innerHTML += `<div id="keyListElement" class="keylist-element">${key}<div class="delete-btn" id="delete-${key}">&times;</div></div>`
        //var tempVar = document.getElementById(`delete-${key}`)
        //console.log(tempVar)
        document.addEventListener('click', function(e) {
            if(e.target && e.target.id == `delete-${key}`) {
                removeProjectKey(key)            
            }
        })
    })
    });
}

function addProjectKey(){
    storedKeys.push(addProjKeyInput.value.toUpperCase())
    storeProjectKeys(storedKeys)
    resetInputValue(addProjKeyInput)
    useStoredOptionsForDisplayInDOM()
 }

 function removeProjectKey(projectKey){
    storedKeys = storedKeys.filter(item => item !== projectKey);
    storeProjectKeys(storedKeys)
 }

function resetInputValue(input){
    input.value = ""
}

function storeProjectKeys(projectKeys){
    chrome.storage.local.set({
        projectKeys: projectKeys
        })
    useStoredOptionsForDisplayInDOM()
}

function controlModalDisplayStyle(display, modalType){    
    modalType.style.display = `${display}`
}

function generateJiraUrl(){
    return (`https://<b style="color: green;">${companyInput.value}</b>.${jiraBaseUrl.value}`);
}

function updateJiraUrlInUrlCompositionDom(){
    urlComposition.innerHTML = generateJiraUrl();
}

function storeJiraUrlElements(companyName, jiraBaseUrl){
    chrome.storage.local.set({
        companyName: companyName,
        jiraBaseUrl: jiraBaseUrl
        })
}
// TODO: loading works, populate fields
function loadJiraUrlElements(){
    chrome.storage.local.get({companyName: '', jiraBaseUrl: ''}, function(items) {
        alert(items.companyName + items.jiraBaseUrl)
    } )
} 