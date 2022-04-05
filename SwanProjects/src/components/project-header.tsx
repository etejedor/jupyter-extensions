import React from 'react';
import { LabIcon, folderIcon } from '@jupyterlab/ui-components';
import { swanProjectIcon } from './icons';
import { Alert } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import { ProjectData } from '../types';
import { ThemeProvider } from './theme-provider';

export function ProjectHeader(props: {
  project?: ProjectData | null;
  isProjectAllowedInPath: boolean;
  cwd: string;
  onClickChangeStack: () => void;
}): JSX.Element {
  const softwareStackMessage =
    props.project?.stack?.type && props.project?.stack?.type != 'default'
      ? `Project Environment: ${props.project?.stack?.release} (${props.project?.stack?.type})`
      : 'Default stack selected for the session';

  return (
    <ThemeProvider theme={'light'}>
      <div className="sw-launcher-project-header">
        <div className="sw-launcher-project-header-bar">
          <LabIcon.resolveReact
            icon={props.project ? swanProjectIcon : folderIcon}
            stylesheet="launcherSection"
          />
          <h2 className="jp-Launcher-sectionTitle sw-laucher-project-header-title">
            {props.cwd || 'Home'}
          </h2>
          <div className="sw-launcher-project-header-right">
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                props.onClickChangeStack();
              }}
              disabled={!props.isProjectAllowedInPath}
            >
              {props.project ? 'Edit Project' : 'Create Project'}
            </Button>
          </div>
        </div>
        {props.project && (
          <div className="sw-launcher-project-header-root-path">
            Project Folder: {props.project?.full_path}
          </div>
        )}

        {props.project ? (
          <Alert severity="info">
            This folder is part of a project. Notebooks in a project run using the
            software stack defined for the project or use the default software stack of the session if 'default' is selected.
          </Alert>
        ) : (
          ''
        )}
        <div className="sw-launcher-project-environment">
          <div>
            <b>Software Stack</b>
          </div>
          {softwareStackMessage}
        </div>
      </div>
    </ThemeProvider>
  );
}
