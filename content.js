let keywords = [];
const colors = ['yellow', 'lightgreen', 'lightblue', 'lightcoral', 'lightpink', 'lightsalmon', 'lightgoldenrodyellow', 
    'lightseagreen', 'lightsteelblue', 'lightcyan', 'lightgray'];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'highlightKeyword') {
        addKeyword(message.keyword);
        highlightKeyword(message.keyword);
    }
});

function addKeyword(keyword) {
    if (!keywords.includes(keyword)) {
        keywords.push(keyword);
        console.log("keyword array:", keywords);
    }
}

function highlightKeyword(keyword) {
    const colorClass = `highlight-${keywords.indexOf(keyword) % colors.length}`;
    const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
    traverseAndHighlight(document.body, regex, colorClass);
}

function traverseAndHighlight(node, regex, colorClass) {
    if (node.nodeType === 3) {
        const matches = node.nodeValue.match(regex);
        if (matches && !node.parentNode.classList.contains('highlight')) {
            const parent = node.parentNode;
            const text = node.nodeValue;
            const fragments = text.split(regex);

            fragments.forEach((fragment, index) => {
                if (regex.test(fragment)) {
                    const span = document.createElement('span');
                    span.className = `highlight ${colorClass}`;
                    span.textContent = fragment;
                    parent.insertBefore(span, node);
                } else {
                    const textNode = document.createTextNode(fragment);
                    parent.insertBefore(textNode, node);
                }
            });

            parent.removeChild(node);
        }
    } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
        for (let i = 0; i < node.childNodes.length; i++) {
            traverseAndHighlight(node.childNodes[i], regex, colorClass);
        }
    }
}

const style = document.createElement('style');
let styleContent = `
        .highlight {
            font-weight: bold;
        }
    `;
    colors.forEach((color, index) => {
        styleContent += `
            .highlight-${index} {
                background-color: ${color};
            }
        `;
    });
style.innerHTML = styleContent;
document.head.appendChild(style);