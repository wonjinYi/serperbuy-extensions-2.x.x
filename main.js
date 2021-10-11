import { goraniStore } from './libraries/goraniStore/src/goraniStore.js';
import { store_main, store_GinPixel } from '../storeList.js';

import { GinPixelManager } from './modules/GinPixel.js';
import { ForkLaneManager } from './modules/ForkLane.js';

const stroeList = store_main;

export const main = () => {
    console.log('run contentscript');
    const isEnabled = new goraniStore(stroeList.isEnabled);

    // request routing
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            let farewell = null;
            const { targetModule, action } = request;
            console.log(targetModule, action);

            if (targetModule === 'main') {
                if (action === 'init') {
                    console.log('팝업의 이닛 요청');
                    farewell = { isEnabled: isEnabled.get() };
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
                    GinPixelManager({ task: action, data: request.data });
                    console.log('저장완료')
                    farewell = targetModule;
                }
            } else if (targetModule === 'ForkLane') {
                console.log('ForkLane');
                if (action === 'enable') {
                    console.log('ForkLane 켜기')
                    isEnabled.set({ ...isEnabled.get(), ForkLane: true });
                    ForkLaneManager({ task: action });
                    farewell = targetModule;
                } else if (action === 'disable') {
                    console.log('ForkLane 끄기')
                    isEnabled.set({ ...isEnabled.get(), ForkLane: false });
                    ForkLaneManager({ task: action });
                    farewell = targetModule;
                }
            }

            sendResponse({ farewell });
        });


    (isEnabled.get().GinPixel) ? (GinPixelManager({ task: 'enable' })) : null;
    (isEnabled.get().ForkLane) ? (ForkLaneManager({ task: 'enable' })) : null;


}