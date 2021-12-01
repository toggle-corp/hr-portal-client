import React, { useContext, useState, useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { removeNull } from '@togglecorp/toggle-form';

import { UserContext } from '#base/context/UserContext';
import PreloadMessage from '#base/components/PreloadMessage';
import { Project } from '#base/types/project';
import { MeQuery } from '#generated/types';
import {
    ProjectContext,
    ProjectContextInterface,
} from '#base/context/ProjectContext';

const ME = gql`
    query Me {
        me {
            id
            firstName
            isActive
            lastName
        }
    }
`;

interface Props {
    className?: string;
    children: React.ReactNode;
}
function Init(props: Props) {
    const {
        className,
        children,
    } = props;
    const {
        setUser,
    } = useContext(UserContext);

    const [ready, setReady] = useState(false);
    const [errored, setErrored] = useState(false);
    const [project, setProject] = useState<Project | undefined>(undefined);

    useQuery<MeQuery>(ME, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            const safeMe = removeNull(data.me);
            if (safeMe) {
                setUser(safeMe);
                // setProject(safeMe.lastActiveProject ?? undefined);
            } else {
                setUser(undefined);
                setProject(undefined);
            }
            setReady(true);
        },
        onError: () => {
            setErrored(false);
            setReady(true);
        },
    });

    const projectContext: ProjectContextInterface = useMemo(
        () => ({
            project,
            setProject,
        }),
        [project],
    );

    if (errored) {
        return (
            <PreloadMessage
                className={className}
                heading="Oh no!"
                content="Some error occurred"
            />
        );
    }
    if (!ready) {
        return (
            <PreloadMessage
                className={className}
                content="Checking user session..."
            />
        );
    }

    return (
        <ProjectContext.Provider value={projectContext}>
            {children}
        </ProjectContext.Provider>
    );
}

export default Init;
