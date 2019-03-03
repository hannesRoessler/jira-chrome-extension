const submitBtn = document.getElementById('submit-btn')
const addProjBtn = document.getElementById('addproject-btn')
const urlBtn = document.getElementById('url-btn')
const addProjKeyInput = document.getElementById('addProjectKey-input')
const addProjKeyBtn = document.getElementById('addProjectKey-btn')
const cancelBtn = document.getElementById('cancel-btn')
const keysModal = document.getElementById('keys-modal')
const urlModal = document.getElementById('url-modal')
const keyList = document.getElementById('keyList')
const modalBackground = document.getElementById('modal-background')
const issueIdInput = document.getElementById('id-input')
const urlComposition = document.getElementById('url-composition')
const projectKeySelect = document.getElementById('project-select')
const saveJiraUrlBtn = document.getElementById('save-url-btn')
const deleteBtn = document.getElementById('delete-btn')
const companyInput = document.getElementById('company-input')
const jiraBaseUrl = document.getElementById('jira-url-input')
//let jiraUrl = ""
let storedKeys = ["1"] 

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
submitBtn.onclick = () => openNewTab(issueIdInput.value);
window.onload = () => {
    useStoredOptionsForDisplayInDOM()
    populateUrlFieldsWithUrlElements()
}
projectKeySelect.onchange = makeDropDownSelectionDefault;
issueIdInput.onkeyup = () => {
    if (event.keyCode === 13) {
        openNewTab(issueIdInput.value);
     }
}
companyInput.addEventListener('keyup',function(){
    updateJiraUrlInUrlCompositionDom()
});
jiraBaseUrl.addEventListener('keyup',function(){updateJiraUrlInUrlCompositionDom()});


function openNewTab(inputValue) {
    let url = generateIssueUrl(inputValue)
    chrome.tabs.create({'url': url});
}

// Puts latest selection to top to make it default one for page reloads
function makeDropDownSelectionDefault(){
    // TODO: make general function that takes param and makes it first array element
    storedKeys = storedKeys.filter(item => item !== projectKeySelect.value);
    storedKeys.unshift(projectKeySelect.value);
    storeProjectKeys(storedKeys)
}

function generateIssueUrl(inputValue) {    
    return `https://${companyInput.value}.${jiraBaseUrl.value + projectKeySelect.value}${inputValue ? '-' + issueIdInput.value : ''}`
}

function useStoredOptionsForDisplayInDOM() {
    chrome.storage.local.get({
        // TODO: build solution to create key if not existent, build general function
        // TODO: remove update-DOM logic from loadKeys from chrome storage
        projectKeys: [],
    }, function(items) {
        //Store retrieved options as the selected values in the DOM
        if (items.projectKeys == "") {
            controlModalDisplayStyle("block", keysModal)
        }
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

function loadJiraUrlElements(cb){
    chrome.storage.local.get({companyName: '', jiraBaseUrl: ''}, function(items) {
        if (items.companyName == "" || items.jiraBaseUrl == "") {
            controlModalDisplayStyle("block", urlModal)
        }
        else {
            let jiraUrlItems = {
                companyName: items.companyName,
                jiraBaseUrl: items.jiraBaseUrl
            }
            cb && cb(jiraUrlItems);
        }
     })
}

function populateUrlFieldsWithUrlElements(){
    loadJiraUrlElements(function(value) {
        companyInput.value = value.companyName;
        jiraBaseUrl.value = value.jiraBaseUrl;
        updateJiraUrlInUrlCompositionDom()
    })

}
