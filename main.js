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

            if (targetModule === 'main') {
                if (action === 'init') {
                    console.log('[main] init requested from popup.js');
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
                    farewell = settingsData;
                } else if (action === 'settings_set') {
                    GinPixelManager({ task: action, data: request.data });
                    farewell = targetModule;
                }
            } else if (targetModule === 'ForkLane') {
                if (action === 'enable') {
                    isEnabled.set({ ...isEnabled.get(), ForkLane: true });
                    ForkLaneManager({ task: action });
                    farewell = targetModule;
                } else if (action === 'disable') {
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