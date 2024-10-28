document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('keyword-form');
    const keywordList = document.getElementById('keyword-list');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const keywordInput = document.getElementById('keyword');
        const keyword = keywordInput.value.trim();

        if (keyword) {
            addKeywordToList(keyword);
            sendKeywordToContentScript(keyword);
            keywordInput.value = '';
        }
    });

    function addKeywordToList(keyword) {
        const li = document.createElement('li');
        li.textContent = keyword;
        keywordList.appendChild(li);
    }

    function sendKeywordToContentScript(keyword) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabId = tabs[0].id;
    
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabId },
                    files: ['content.js']
                },
                () => {
                    chrome.tabs.sendMessage(tabId, { action: 'highlightKeyword', keyword }, (response) => {
                        if (chrome.runtime.lastError) {
                            console.error(chrome.runtime.lastError.message);
                        } else {
                            console.log("Message sent to content script:", keyword);
                        }
                    });
                }
            );
        });
    }

    // function sendKeywordToContentScript(keyword) {
    //     console.log("i sent a message to chrome tabs", keyword);
    //     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //         chrome.tabs.sendMessage(tabs[0].id, { action: 'highlightKeyword', keyword });
    //     });
    // }
});