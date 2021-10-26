import { getElementByXpath } from "../tools/getElementByXpath.js";
import { waitElementLoad } from "../tools/waitElementLoad.js";

const XpathList = {
    modeBtn: '/html/body/div[1]/div[1]/div[3]/span/a',
    zoomPercentageInput: {
        view: '/html/body/div[1]/div[1]/div[1]/div/div[2]/div[3]/div[2]/div/input',
        edit: '/html/body/div[1]/div[1]/div[1]/div/div[2]/div[3]/div[3]/div/input',
    },
};

const ChookjiLaw = () => {
    
    
    let isCtrl = false;
    let isShift = false;

    const handleKeyup = (e) => {
        if (e.key === 'Control') { isCtrl = false; }
        if (e.key === 'Shift') { isShift = false; }
    };

    const handleKeydown = (e) => {
        if (e.key === 'Control') { isCtrl = true; }
        if (e.key === 'Shift') { isShift = true; }

        if (e.key === 'c' || e.key === 'C') {
            if(isShift && !isCtrl){
                const modeBtn = getElementByXpath(XpathList.modeBtn);
                if (modeBtn) {
                    modeBtn.click();
                }
            } else if(isShift && isCtrl){
                isCtrl = false;
                isShift = false;

                const suiteMode = (location.pathname.split('/'))[2];
                if(suiteMode==='view' || suiteMode==='edit'){
                    const currentUrl = location.href;
                    const splitted = currentUrl.split(suiteMode);

                    const newMode = (suiteMode==='view') ? 'edit' : 'view';
                    const newUrl = splitted[0]+newMode+splitted[1];
                    const newTab = window.open(newUrl, '_blank');
                    newTab.focus();
                } 
                
            }
        }
    };

    window.addEventListener('keyup', handleKeyup);
    window.addEventListener('keydown', handleKeydown);


    // PublicMethod
    const disable = () => {
        window.removeEventListener('keyup', handleKeyup);
        window.removeEventListener('keydown', handleKeydown);
    }

    console.log('ChookjiLaw is running');
    return { disable }
};

/////////////////////////

let PublicMethod = null;

const ChookjiLawManager = ({ task, data }) => {
    if (task === 'enable') {
        const suiteMode = (location.pathname.split('/'))[2];
        waitElementLoad({
            maxWaitTime: 10,
            findInterval: 1,
            elementXpath: XpathList.modeBtn,
            callback: () => { PublicMethod = ChookjiLaw() },
        });
    } else if (task === 'disable') {
        PublicMethod.disable();
    }
}

export { ChookjiLawManager };