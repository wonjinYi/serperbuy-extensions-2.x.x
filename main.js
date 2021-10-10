import { GinPixelManager } from './modules/GinPixel.js';
import { goraniStore } from './libraries/goraniStore/src/goraniStore.js';
import { store_main, store_GinPixel } from '../storeList.js';

const stroeList = store_main;


export const main = () => {
    console.log('run contentscript');

    const isEnabled = new goraniStore(stroeList.isEnabled);

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            let farewell = null;
            const { targetModule, action } = request;
            console.log(targetModule, action);

            if (targetModule === 'main') {
                if (action === 'init') {
                    console.log('팝업의 이닛 요청');
                    farewell = { isEnabled : isEnabled.get() };
                }
            } else if (targetModule === 'GinPixel') {
                if (action === 'enable') {
                    GinPixelManager({ task: 'enable' });
                    isEnabled.set({ ...isEnabled.get(), GinPixel: true });
                    farewell = targetModule;
                } else if (action === 'disable') {
                    GinPixelManager({ task: 'disable' });
                    isEnabled.set({ ...isEnabled.get(), GinPixel: false });
                    farewell = targetModule;
                } else if (action === 'settings_get') {
                    const settingsData = GinPixelManager({ task: action });
                    console.log('불러오기완료');
                    farewell = settingsData;
                } else if (action === 'settings_set') {
                    GinPixelManager({ task: action, data: request.data});
                    console.log('저장완료')
                    farewell = targetModule;
                }
            } else if (targetModule === 'Excavator') {
                console.log('excavator');
                if (action === 'enable') {
                    console.log('익스카바이터 켜기')
                    isEnabled.set({ ...isEnabled.get(), Excavator: true });
                    farewell = targetModule;
                } else if (action === 'disable') {
                    console.log('익스카바이터 끄기')
                    isEnabled.set({ ...isEnabled.get(), Excavator: false });
                    farewell = targetModule;
                }
            }

            sendResponse({ farewell });
        });


    
    if(isEnabled.get().GinPixel){
        GinPixelManager({ task: 'enable' });
    }
    
}