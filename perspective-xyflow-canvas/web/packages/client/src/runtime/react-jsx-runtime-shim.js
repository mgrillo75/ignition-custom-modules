import React from "react";

function withKey(props, key) {
    if (key === undefined) {
        return props;
    }

    return Object.assign({}, props, { key });
}

export const Fragment = React.Fragment;

export function jsx(type, props, key) {
    return React.createElement(type, withKey(props, key));
}

export const jsxs = jsx;
export const jsxDEV = jsx;
