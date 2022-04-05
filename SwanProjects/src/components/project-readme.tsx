import React from 'react';
import { LabIcon } from '@jupyterlab/ui-components';
import { swanReadmeIcon } from './icons';
import ReactMarkdown from 'react-markdown';

export function ProjectReadme(props: {
  readme: string;
  is_project: boolean;
}): JSX.Element {
  if (props.is_project && props.readme !== null) {
    return (
      <div
        className="jp-Launcher-section"
        key="Readme"
        style={{ display: props.is_project ? '' : 'none' }}
      >
        <div className="jp-Launcher-sectionHeader">
          <LabIcon.resolveReact
            icon={swanReadmeIcon}
            stylesheet="launcherSection"
          />
          <h2 className="jp-Launcher-sectionTitle">Readme</h2>
        </div>
        <div className="jp-Launcher-cardContainer"></div>
        <ReactMarkdown>{props.readme}</ReactMarkdown>
      </div>
    );
  } else {
    return <div />;
  }
}
