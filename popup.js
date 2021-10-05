

console.log('run popup');
const $btn = document.getElementById('send');
$btn.onclick = () => {
    // chrome.tabs.sendMessage({greeting: 'hello content script'}, (response) => {
    //     console.log("[popup] chrome.runtime.sendMessage()");
    //     console.log(response.farewell);
    // });

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log(tabs);
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
          console.log(response.farewell);
        });
      });
}
