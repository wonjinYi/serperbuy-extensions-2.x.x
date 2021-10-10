export const store_main = {
    isEnabled: {
        key: "Serperbuy_sizeChecker_isEnabled",
        defaultValue: {
            GinPixel: true,
            Excavator: true,
        },
        type: "Object",
    }
}

export const store_GinPixel = {
    imageSize: {
        key: "Serperbuy_sizeChecker_imageSize",
        defaultValue: {
            width: 1920,
            height: 1080,
        },
        type: "Object"
    },
    sizeCheckList: {
        key: "Serperbuy_sizeChecker_sizeCheckList",
        defaultValue: [0, 50, 100],
        type: "Array"
    },
    defaultFitScreenPercentage: {
        key: "Serperbuy_sizeChecker_defaultFitScreenPercentage",
        defaultValue: 0.95,
        type: "Number"
    },
    userColor: {
        key: "Serperbuy_sizeChecker_userColor",
        defaultValue: 'white',
        type: "String"
    }
}