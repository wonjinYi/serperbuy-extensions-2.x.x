import { repeatUntilBreak } from '../tools/repeatUntilBreak.js';
import { waitElementLoad } from '../tools/waitElementLoad.js';
import useCharacterAsCursor from '../tools/useCharacterAsCursor.js';

const XpathList = {
    ObjectList: '/html/body/div[1]/div[1]/div[2]/div/div[1]/div[2]/div[5]/div',
    articleArea: '/html/body/div[1]/div[1]/div[2]',
}
const groupTitleHeight = {
    min : 37,
    max : 38,
}

const ForkLane = () => {
    let isCtrl = false;
    let isShift = false;
    
    const toggleHide = (objectsInGroup) => {
        if (objectsInGroup) {
            const eyes = [];
            objectsInGroup.forEach(object => {
                const eye = object.childNodes[3].childNodes[0];
                eyes.push({
                    element: eye,
                    color: eye.getAttribute('color'),
                });
            });

            const eyesColor = eyes.map(eye => eye.color);
            if (eyesColor.includes('grey')) {
                eyes.forEach(eye => {
                    if (eye.color == 'grey') { eye.element.click(); }
                });
            } else {
                eyes.forEach(eye => { eye.element.click(); })
            }
        }
    }

    const handleClickObjectList = (e) => {
        document.body.style.cursor = "default";
        window.removeEventListener('click', handleClickObjectList);

        let target = null;
        let objectsInGroup = null;

        const isGroupTitle = (num) => (( groupTitleHeight.min < num ) && ( num <= groupTitleHeight.max));

        const path = e.path;
        if (path.length === 15 && isGroupTitle(Number(path[2].dataset.knownSize))) { // title test.
            target = path[2];
        } else if (path.length === 19 && isGroupTitle(Number(path[6].dataset.knownSize))) { // title div area.
            target = path[6];
        } else { // others.
            return;
        }

        // expand/fold Annotation List of the selected group.
        if (!target.nextSibling || isGroupTitle(Number(target.nextSibling.dataset.knownSize))) { // When Annotation list of the selected grup is folded.
            const expandBtn = target.childNodes[0].childNodes[1].childNodes[0].childNodes[0];
            expandBtn.click(); // expand.
            repeatUntilBreak({
                reps: 20,
                timeInterval: 0.05,
                repeatFunction: () => {
                    const el = target.nextSibling;
                    const breakCondition = (el && !isGroupTitle(Number(el.dataset.knownSize)))
                        ? true
                        : false;
                    return breakCondition;
                },
                callbackAfterRepeat: () => {
                    objectsInGroup = target.nextSibling.childNodes;
                    toggleHide(objectsInGroup);
                    expandBtn.click(); // fold
                },
            });
        } else {
            objectsInGroup = target.nextSibling.childNodes;
            toggleHide(objectsInGroup);
        }
    };

    const activeSelectMode = () => {
        window.addEventListener('click', handleClickObjectList);
        useCharacterAsCursor('👀');
    }

    const handleKeyup = (e) => {
        if (e.key === 'Control') { isCtrl = false; }
        if (e.key === 'Shift') { isShift = false; }
    };

    const handleKeydown = (e) => {
        if (e.key === 'Control') { isCtrl = true; }
        if (e.key === 'Shift') { isShift = true; }

        if (e.key === 'f' || e.key === 'F') {
            if (isShift && !isCtrl) {
                waitElementLoad({
                    maxWaitTime: 3,
                    findInterval: 0.05,
                    elementXpath: XpathList.ObjectList,
                    callback: activeSelectMode,
                })
            }
        }
    };

    window.addEventListener('keyup', handleKeyup);
    window.addEventListener('keydown', handleKeydown);


    // ForkLanePublicMethod
    const disable = () => {
        window.removeEventListener('keyup', handleKeyup);
        window.removeEventListener('keydown', handleKeydown);
        window.removeEventListener('click', handleClickObjectList);
        document.body.style.cursor = "default";
    }
    
    console.log('ForkLane is running');
    return { disable };
}

///////////////////////////////

let ForkLanePublicMethod = null;

const ForkLaneManager = ({ task, data }) => {
    if (task === 'enable') {
        waitElementLoad({
            maxWaitTime: 10,
            findInterval: 1,
            elementXpath: XpathList.ObjectList,
            callback: () => { ForkLanePublicMethod = ForkLane() },
        });
    } else if (task === 'disable') {
        ForkLanePublicMethod.disable();
    }
}
export { ForkLaneManager };