import { goraniStore } from '../libraries/goraniStore/src/goraniStore.js';
import { store_GinPixel } from '../storeList.js';

import { waitElementLoad } from '../tools/waitElementLoad.js';
import { repeatUntilBreak } from '../tools/repeatUntilBreak.js';
import { getElementByXpath } from '../tools/getElementByXpath.js';
import { removeElement } from '../tools/removeElement.js';

const XPathList = {
    upperCanvas: '/html/body/div[1]/div[1]/div[2]/div[2]/div[1]/canvas',
    articleArea: '/html/body/div[1]/div[1]/div[2]',
    modeBtn: '/html/body/div[1]/div[1]/div[3]',
    zoomPercentageInput: {
        view: '/html/body/div[1]/div[1]/div[1]/div/div[2]/div[3]/div[2]/div/input',
        edit: '/html/body/div[1]/div[1]/div[1]/div/div[2]/div[3]/div[3]/div/input',
    },
    zoomCombobox: {
        view: '/html/body/div[1]/div[1]/div[1]/div/div[2]/div[3]/div[2]/div',
        edit: '/html/body/div[1]/div[1]/div[1]/div/div[2]/div[3]/div[3]/div',
    },
    zoomDropdown: '/html/body/div[3]/div',
    fitscreenBtn: '/html/body/div[1]/div[1]/div[1]/div/div[2]/div[3]/span/button',
};

const storeList = store_GinPixel;
const approximateConst = 0.005;
const documentSize = {
    width: document.body.offsetWidth,
    height: document.body.offsetHeight,
};


const GinPixel = () => {
    // declare local storage Objects
    const imageSize = new goraniStore(storeList.imageSize);
    const sizeCheckList = new goraniStore(storeList.sizeCheckList);
    const defaultFitScreenPercentage = new goraniStore(storeList.defaultFitScreenPercentage);
    const userColor = new goraniStore(storeList.userColor);

    
    // declare (almost) global variables
    let suiteMode = (location.pathname.split('/'))[2];

    let ratio;
    let resized;
    let mode = 0;
    let zoomPercentage = 0;

    let isCtrl = false;
    let isShift = false;


    // declare sizeChecker elements.
    let articleArea = getElementByXpath(XPathList.articleArea);
    let modeBtn = getElementByXpath(XPathList.modeBtn);
    let zoomPercentageInput = null; // get element when init() is called
    let zoomCombobox = null;
    let fitscreenBtn = getElementByXpath(XPathList.fitscreenBtn);

    const container = document.createElement('div');
    const caption = document.createElement('p');
    const rect = document.createElement('div');


    // declare functions.
    const getRatio = () => {
        const originSize = imageSize.get()
        const upperCanvas = getElementByXpath(XPathList.upperCanvas);
        if (upperCanvas) {
            const canvasHeight = upperCanvas.offsetHeight;
            const canvasWidth = upperCanvas.offsetWidth;

            // 비율 산출 기준방향 결정
            const defaultHeightRatio = (canvasHeight * defaultFitScreenPercentage.get()) / originSize.height;
            const defaultWidthRatio = (canvasWidth * defaultFitScreenPercentage.get()) / originSize.width;
            const defaultRatioDirection = (defaultHeightRatio < defaultWidthRatio) ? 'height' : 'width';

            const approximatedZoom = (zoomPercentage === defaultFitScreenPercentage.get())
                ? zoomPercentage
                : zoomPercentage + approximateConst;

            switch (defaultRatioDirection) {
                case 'height':
                    ratio = (canvasHeight * approximatedZoom) / originSize.height;
                    break;
                case 'width':
                    ratio = (canvasWidth * approximatedZoom) / originSize.width;
                    break;
            }

            return ratio;
        } else {
            console.error('[GinPixel]There is no Canvas');
            return false;
        }
    };

    const getZoomPercentage = () => {
        if (zoomPercentageInput) {
            return ((Number((zoomPercentageInput.value).split('%')[0])) / 100.0);
        } else {
            console.error(`[GinPixel-getZoomPercentage]Can not find zoomInput. It returns defaultFitScreenPercentage ( ${defaultFitScreenPercentage} )`);
            return defaultFitScreenPercentage.get();
        }
    };

    const refreshStyle = () => {
        const chkSize = (sizeCheckList.get())[mode];
        if (chkSize === 0) {
            container.style.visibility = 'hidden';
        } else {
            container.style.visibility = 'visible';

            ratio = getRatio();
            resized = Math.ceil(chkSize * ratio);

            const errorBoundary = (zoomPercentage === defaultFitScreenPercentage.get())
                ? 1
                : Math.ceil(chkSize * approximateConst);
            //console.log('[GinPixel]displayed size : ', resized);

            rect.style.width = `${resized}px`;
            rect.style.height = `${resized}px`;
            rect.style.border = `1px solid ${userColor.get()}`;
            caption.textContent = `${chkSize}px(±${errorBoundary}px)`;
            caption.style.color = userColor.get();
        }
    };

    // Detect User Key Input : Shift+X , Ctrl+Shift+X
    const handleKeyup = (e) => {
        if (e.key === 'Control') { isCtrl = false; }
        if (e.key === 'Shift') { isShift = false; }
    };

    const handleKeydown = (e) => {
        if (e.key === 'Control') { isCtrl = true; }
        if (e.key === 'Shift') { isShift = true; }

        if (e.key === 'x' || e.key === 'X') {
            if (isCtrl && isShift) {
                (userColor.get() === 'black' ? userColor.set('white') : userColor.set('black'));
                refreshStyle();
                //console.log('color');
            } else if (isShift) {
                (mode === (sizeCheckList.get()).length - 1 ? mode = 0 : mode++);
                refreshStyle();
                //console.log('size')
            }
        }
        else if (e.key === 'r' || e.key === 'R') {
            if (!isCtrl && !isShift) {
                handleZoomInputChange();
            }
        }
    };

    // move SizeChecker Square and Caption, with client mouse cursor
    const handleMousemove = (e) => {
        caption.style.bottom = `${documentSize.height - e.clientY}px`;
        caption.style.left = `${e.clientX}px`;
        rect.style.bottom = `${documentSize.height - e.clientY}px`;
        rect.style.right = `${documentSize.width - e.clientX}px`;
    };

    const handleZoomInputChange = (e) => {
        setTimeout(() => {
            zoomPercentage = getZoomPercentage();
            refreshStyle();
        }, 100)
    };

    const handleClickZoomCombobox = (e) => {
        waitElementLoad({
            maxWaitTime: 3,
            findInterval: 0.5,
            elementXpath: XPathList.zoomDropdown,
            callback: () => {
                const zoomDropdown = getElementByXpath(XPathList.zoomDropdown);
                zoomDropdown.addEventListener('click', handleZoomInputChange);

                const handleEnd = (e) => {
                    if (e.target != zoomCombobox && e.target != zoomPercentageInput) {
                        zoomDropdown.removeEventListener('click', handleZoomInputChange);
                        window.removeEventListener('click', handleEnd);
                    }
                };
                window.addEventListener('click', handleEnd);
            }
        })
    };

    // Reload each element When User Change Labeling mode - Review mode
    const handleClickModeBtn = (e) => {
        console.log('눌렸당')
        repeatUntilBreak({
            reps: 40,
            timeInterval: 0.05,
            repeatFunction: () => {
                const newSuiteMode = (location.pathname.split('/'))[2];
                if(suiteMode !== newSuiteMode){
                    suiteMode = newSuiteMode;
    
                    zoomPercentageInput.removeEventListener('change', handleZoomInputChange);
                    zoomCombobox.removeEventListener('click', handleClickZoomCombobox);
                    modeBtn.removeEventListener('click', handleClickModeBtn);
    
                    articleArea = getElementByXpath(XPathList.articleArea);
                    articleArea.appendChild(container);
                    modeBtn = getElementByXpath(XPathList.modeBtn);
                    zoomPercentageInput = getElementByXpath(XPathList.zoomPercentageInput[suiteMode]);
                    zoomCombobox = getElementByXpath(XPathList.zoomCombobox[suiteMode]);
    
                    modeBtn.addEventListener('click', handleClickModeBtn);
                    zoomPercentageInput.addEventListener('change', handleZoomInputChange);
                    zoomCombobox.addEventListener('click', handleClickZoomCombobox);
    
                    handleZoomInputChange();
    
                    return true; // break
                }
            },
            callbackAfterRepeat: () => {}, // no action after break
        });
    };

    // initialize
    const init = () => {
        // init dom element
        container.style.position = "fixed";
        container.style.pointerEvents = "none";
        container.style.zIndex = '101';
        caption.style.position = "fixed";
        caption.style.left = "50%"
        caption.style.bottom = "50%"
        rect.style.position = "fixed";
        rect.style.right = "50%";
        rect.style.bottom = "50%";

        container.appendChild(caption);
        container.appendChild(rect);
        articleArea.appendChild(container);

        console.log(suiteMode ,container);


        // init zoom
        zoomPercentageInput = getElementByXpath(XPathList.zoomPercentageInput[suiteMode]);
        zoomPercentage = getZoomPercentage();

        zoomCombobox = getElementByXpath(XPathList.zoomCombobox[suiteMode]);

        // add Eventlisteners
        window.addEventListener('keyup', handleKeyup);
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('mousemove', handleMousemove);
        modeBtn.addEventListener('click', handleClickModeBtn);

        window.addEventListener('mousewheel', handleZoomInputChange);
        fitscreenBtn.addEventListener('click', handleZoomInputChange);
        zoomPercentageInput.addEventListener('change', handleZoomInputChange);
        zoomCombobox.addEventListener('click', handleClickZoomCombobox);

        // initial refresh
        refreshStyle();
    };

    waitElementLoad({
        maxWaitTime: 5,
        findInterval: 0.05,
        elementXpath: XPathList.zoomPercentageInput[suiteMode],
        callback: init,
    });

    

    // below are called from popup.js - main.js
    const disable = () => {
        const removeListener = () => {
            window.removeEventListener('keyup', handleKeyup);
            window.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('mousemove', handleMousemove);
            modeBtn.removeEventListener('click', handleClickModeBtn);

            window.removeEventListener('mousewheel', handleZoomInputChange);
            fitscreenBtn.removeEventListener('click', handleZoomInputChange);
            zoomPercentageInput.removeEventListener('change', handleZoomInputChange);
            zoomPercentageInput.removeEventListener('click', handleZoomInputChange);
        }

        const removeSuccess = (container) && removeElement(container);
        if (removeSuccess) {
            removeListener();
        } else {
            repeatUntilBreak({
                reps: 10,
                timeInterval: 0.5,
                repeatFunction: () => {
                    const removeSuccess = (container) && removeElement(container);
                    if (removeSuccess) {
                        removeListener();
                        return true;
                    } else {
                        return false;
                    }
                },
                callbackAfterRepeat: () => {
                    console.info('[GinPixel]Lazy disable is completed');
                },
            });

            console.warn("[GinPixel]disable() can't remove undefined element(container)");
        }
    };

    const getSettings = () => {
        return {
            sizeCheckList: sizeCheckList.get(),
            imageSize: imageSize.get(),
        };
    };

    const setSettings = (newValues) => {
        sizeCheckList.set(newValues.sizeCheckList);
        imageSize.set(newValues.imageSize);
    };
    console.log('GinPixel is running');
    return { disable, getSettings, setSettings };
};

////////////////////////////////////

let GinPixelPublicMethod = null;

const GinPixelManager = ({ task, data }) => {
    if (task === 'enable') {
        waitElementLoad({
            maxWaitTime: 10,
            findInterval: 0.05,
            elementXpath: XPathList.upperCanvas,
            callback: () => { 
                GinPixelPublicMethod = GinPixel();
            },
        });
    } else if (task === 'disable') {
        GinPixelPublicMethod.disable();
    } else if (task === 'settings_get') {
        return GinPixelPublicMethod.getSettings();
    } else if (task === 'settings_set') {
        GinPixelPublicMethod.setSettings(data);
    }
};

export { GinPixelManager };