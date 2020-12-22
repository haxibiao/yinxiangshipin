import React, { ReactChildren } from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react';

interface Props {
    visible: boolean;
    children: ReactChildren;
}

export default ({ visible, children }: Props) => {
    if (visible) {
        return children;
    }
    return null;
};
