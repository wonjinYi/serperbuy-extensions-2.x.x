import { repeatUntilBreak } from '../tools/repeatUntilBreak.js';
import { waitElementLoad } from '../tools/waitElementLoad.js';
import useCharacterAsCursor from '../tools/useCharacterAsCursor.js';

const XpathList = {
    ObjectList: '/html/body/div[1]/div[1]/div[2]/div[1]/div[2]/div[5]/div/div',
    articleArea: '/html/body/div[1]/div[1]/div[2]',
}
const groupTitleHeight = '38';


const ForkLane = () => {
    console.log('포크레인 실행됨');

    // 변수 선언
    let isCtrl = false;
    let isShift = false;
    
    // 함수선언
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

        const path = e.path;
        if (path.length === 15 && path[2].dataset.knownSize === groupTitleHeight) {
            target = path[2];
        } else if (path.length === 19 && path[6].dataset.knownSize === groupTitleHeight) {
            target = path[6];
        } else {
            return; // 아쉽게도 그룹이름 영역이 아뉨
        }

        // 접혀있으면 펴기
        if (!target.nextSibling || target.nextSibling.dataset.knownSize === groupTitleHeight) {
            const expandBtn = target.childNodes[0].childNodes[1].childNodes[0].childNodes[0];
            expandBtn.click();
            repeatUntilBreak({
                reps: 20,
                timeInterval: 0.05,
                repeatFunction: () => {
                    const el = target.nextSibling;
                    const breakCondition = (el && el.dataset.knownSize != groupTitleHeight)
                        ? true
                        : false;

                    return breakCondition;
                },
                callbackAfterRepeat: () => {
                    objectsInGroup = target.nextSibling.childNodes;
                    toggleHide(objectsInGroup);
                    expandBtn.click();
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
                    maxWaitTime: 1,
                    findInterval: 0.1,
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