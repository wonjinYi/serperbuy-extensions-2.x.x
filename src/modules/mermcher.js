const XpathList = {
    classSearchInput : '/html/body/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/div[2]/div/input',
};

const Mermcher = () => {

}

////////////////////////////////////

let MermcherPublicMethod = null;

const MermcherManager = ({ task, data }) => {
    if (task === 'enable') {
        waitElementLoad({
            maxWaitTime: 10,
            findInterval: 0.05,
            elementXpath: XpathList.classSearchInput,
            callback: () => { 
                MermcherPublicMethod = Mermcher();
            },
        });
    } else if (task === 'disable') {
        MermcherPublicMethod.disable();
    }
};

export { MermcherManager };