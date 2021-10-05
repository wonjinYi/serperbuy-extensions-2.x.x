export const main = () => {
    console.log('run contentscript')
    chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        console.log('[content script] chrome.runtime.onMessage.addListener()');

        //if (request.greeting === 'hello content script') {
            console.log("[content script] request:" + request.greeting);
            // TODO
            sendResponse({ farewell: 'goodbye popup' });
        //}
    });
}