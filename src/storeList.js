export const store_main = {
    isEnabled: {
        key: "Serperbuy_main_isEnabled",
        defaultValue: {
            GinPixel: true,
            ForkLane: false,
            ChookjiLaw: true,
        },
        type: "Object",
    }
}

export const store_GinPixel = {
    imageSize: {
        key: "Serperbuy_GinPixel_imageSize",
        defaultValue: {
            width: 1920,
            height: 1080,
        },
        type: "Object"
    },
    sizeCheckList: {
        key: "Serperbuy_GinPixel_sizeCheckList",
        defaultValue: [0, 50, 100],
        type: "Array"
    },
    defaultFitScreenPercentage: {
        key: "Serperbuy_GinPixel_defaultFitScreenPercentage",
        defaultValue: 0.95,
        type: "Number"
    },
    userColor: {
        key: "Serperbuy_GinPixel_userColor",
        defaultValue: 'white',
        type: "String"
    }
}