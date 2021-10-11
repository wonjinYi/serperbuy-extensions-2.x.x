import { goraniStore } from "./libraries/goraniStore/src/goraniStore.js";
import { store_GinPixel } from "./storeList.js";

// DOM elemetns
const $settingBtn = {
    GinPixel: document.getElementById('setting-open-GinPixel'),
    ForkLane: document.getElementById('setting-open-ForkLane'),
};

const $switchBtn = {
    GinPixel: document.getElementById('switch-GinPixel'),
    ForkLane: document.getElementById('switch-ForkLane'),
};

const $loading = document.getElementById('loading');
const $disablePage = document.getElementById('disable-page');

const $settings = document.getElementById('settings');
const $settingsCloseBtn = document.getElementById('settings-close');
const $settingsCloseWithoutChangeBtn = document.getElementById('settings-close-withoutChange');

// Declare Functions

const sendMessageToContentScript = ({ data, callback }) => {
    chrome.tabs.query({ active: true, currentWindow: true },
        (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, data,
                (response) => {
                    callback(response);
                });
        }
    );
};

const handleSettingBtnClick = (e) => {
    //declare shared variables.
    let targetModule = null;
    let targetModuleSettingsContents = null;

    //declare functions
    const settingsClose = (e) => {
        $settings.style.visibility = 'hidden';
        $settingsCloseBtn.onclick = null;
        $settingsCloseWithoutChangeBtn.onclick = null;

        targetModuleSettingsContents.classList.remove('settings-contents-visible');
    }

    const init = () => {
        loading(true);

        targetModule = e.target.name;
        
        const $settingsContents = $settings.getElementsByClassName('settings-contents');
        for(let i=0; i<$settingsContents.length; i++){
            const el = $settingsContents[i];
            if(el.getAttribute('name') === targetModule){
                targetModuleSettingsContents = el;
                targetModuleSettingsContents.classList.add('settings-contents-visible');
            }
        }

        $settingsCloseWithoutChangeBtn.onclick = settingsClose;
        $settings.style.visibility = 'visible';
    }
    

    // run
    init();

    if (targetModule === 'GinPixel') {
        const $chklist = document.getElementById('settings-GinPixel-input-sizeCheckList');
        const $width = document.getElementById('settings-GinPixel-input-imageSize-width');
        const $height = document.getElementById('settings-GinPixel-input-imageSize-height');

        sendMessageToContentScript({
            data: {
                targetModule: 'GinPixel',
                action: 'settings_get',
            }, callback: (res) => {
                if (res && res.farewell) {
                    const { sizeCheckList, imageSize } = res.farewell;
                    $chklist.value = sizeCheckList;
                    $width.value = imageSize.width;
                    $height.value = imageSize.height;
                    loading(false);
                }
            }
        });

        $settingsCloseBtn.onclick = (e) => {
            try {
                sendMessageToContentScript({
                    data: {
                        targetModule: 'GinPixel',
                        action: 'settings_set',
                        data: {
                            sizeCheckList: JSON.parse(`[${$chklist.value}]`),
                            imageSize: {
                                width: JSON.parse($width.value),
                                height: JSON.parse($height.value),
                            },
                        },
                    }, callback: (res) => {
                        if (res && res.farewell) {
                            console.log(res.farewell);
                            const targetModuleSwitch = $switchBtn[targetModule];
                            if (targetModuleSwitch.checked) { // 해당 기능 활성화 상태이면, 비활성화해주기.
                                targetModuleSwitch.click();
                            }
                            settingsClose();
                        }
                    }
                });
            } catch (err) {
                alert('잘못된 값이 입력되었습니다');
            }
        }
    } else if (targetModule === 'ForkLane') {
        loading(false);
        $settingsCloseBtn.onclick = settingsClose;
    }
};

const enableSettingBtn = (el) => {
    el.disabled = false;
    el.classList.remove('serperb-btn-theme-disabled');
}

const disableSettingBtn = (el) => {
    el.disabled = true;
    el.classList.add('serperb-btn-theme-disabled');
}

const main = () => {
    const handleSwitchClick = (e) => {
        loading(true);

        const isEnabled = e.target.checked;
        const targetModule = e.target.name;

        if (isEnabled) {
            enableSettingBtn($settingBtn[targetModule]);
        } else {
            disableSettingBtn($settingBtn[targetModule]);
        }

        
            sendMessageToContentScript({
                data: {
                    targetModule,
                    action: isEnabled ? 'enable' : 'disable',
                }, callback: (res) => {
                    try{
                        if (res) {
                            console.log(res.farewell)
                            setTimeout(() => loading(false), 1000);
                        }
                    } catch (err) {
                            alert('퀘에엑')
                    }
                    
                }
            })
        
        
    }

    Object.keys($switchBtn).forEach( key => {
        $switchBtn[key].onclick = handleSwitchClick
    });
    Object.keys($settingBtn).forEach( key => {
        $settingBtn[key].onclick = handleSettingBtnClick
    });
};


const init = (isEnabled) => {
    const keys = Object.keys($switchBtn);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        console.log($switchBtn[key], isEnabled[key])
        if (isEnabled[key] != undefined) {
            $switchBtn[key].checked = isEnabled[key];
            if (!isEnabled[key]) { disableSettingBtn($settingBtn[key]); }
        } else {
            $switchBtn[key].checked = false;
        }
    }

    $loading.style.visibility = 'hidden';
};

const loading = (isLoading) => {
    const visibility = isLoading ? 'visible' : 'hidden';
    $loading.style.visibility = visibility;

    return visibility;
};


////////////////

sendMessageToContentScript({
    data: {
        targetModule: 'main',
        action: 'init',
    }, callback: (res) => {
        if (res) {
            const { isEnabled } = res.farewell;
            if (isEnabled) {
                init(isEnabled);
                main();
            }
        } else {
            loading(false);
            $disablePage.style.visibility = 'visible';
        }
    }
})