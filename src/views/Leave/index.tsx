import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.css';

interface Props {
    className?: string;
}

function Leave(props: Props) {
    const { className } = props;

    return (
        <div className={_cs(className, styles.leave)}>
            My Leave
        </div>
    );
}

export default Leave;
