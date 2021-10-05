import { goraniStore } from '../libraries/goraniStore/src/goraniStore.js';

const storeList = {
    imageSize : {
        key : "Serperbuy_sizeChecker_imageSize",
        defaultValue : {
            width : 1920,
            height : 1080,
        },
        type : "Object"
    },
    sizeCheckList : {
        key : "Serperbuy_sizeChecker_sizeCheckList",
        defaultValue : [0, 50, 100],
        type : "Array"
    } 
};

const GinPixel = () => {
    const imageSize = new goraniStore(storeList.imageSize);
    const sizeCheckList = new goraniStore(storeList.sizeCheckList);
}

export { GinPixel };