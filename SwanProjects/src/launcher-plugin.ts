import { toArray } from '@lumino/algorithm';
import { ReadonlyPartialJSONObject } from '@lumino/coreutils';
import { Widget } from '@lumino/widgets';

import {
  ILabShell,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
import { ILauncher, LauncherModel } from '@jupyterlab/launcher';

import { launcherIcon } from '@jupyterlab/ui-components';
import { SWANLauncher } from './launcher';
import { SwanProjectsPlugin, SwanProjectsToken } from './project-plugin';

namespace CommandIDs {
  export const create_launcher = 'launcher:create';
  export const refresh_launcher = 'launcher:refresh';
}

const plugin: JupyterFrontEndPlugin<ILauncher> = {
  activate,
  id: '@swan/launcher-project:plugin',
  requires: [ILabShell, SwanProjectsToken],
  optional: [ICommandPalette],
  provides: ILauncher,
  autoStart: true
};

function activate(
  app: JupyterFrontEnd,
  labShell: ILabShell,
  projects: SwanProjectsPlugin,
  palette: ICommandPalette | null
): ILauncher {
  console.log('swanprojects launcher is activated!');
  if (palette) {
    palette.addItem({
      command: CommandIDs.create_launcher,
      category: 'Launcher'
    });
  }

  const model = new LauncherModel();
  let launcher: SWANLauncher | undefined;
  const { commands } = app;
  let uniqueId = 0;
  app.commands.addCommand(CommandIDs.create_launcher, {
    icon: launcherIcon,
    label: 'SWAN Launcher',
    execute: (args: ReadonlyPartialJSONObject) => {
      const cwd = args['cwd'] ? String(args['cwd']) : '';
      const id = `swan-launcher-${uniqueId++}`;
      const callback = (item: Widget) => {
        labShell.add(item, 'main', { ref: id });
      };

      launcher = new SWANLauncher({ model, cwd, callback, commands }, projects);

      launcher.model = model;
      launcher.title.icon = launcherIcon;
      launcher.title.label = 'SWAN Launcher';
      const main = new MainAreaWidget({ content: launcher });

      // If there are any other widgets open, remove the launcher close icon.
      main.title.closable = !!toArray(labShell.widgets('main')).length;
      main.id = id;
      labShell.add(main, 'main', { activate: args['activate'] as boolean });

      labShell.layoutModified.connect(() => {
        // If there is only a launcher open, remove the close icon.
        main.title.closable = toArray(labShell.widgets('main')).length > 1;
      }, main);

      return main;
    }
  });
  app.commands.addCommand(CommandIDs.refresh_launcher, {
    execute: (args: ReadonlyPartialJSONObject) => {
      launcher?.refresh();
    }
  });
  if (palette) {
    palette.addItem({
      command: CommandIDs.create_launcher,
      category: 'SWAN'
    });
  }

  return model;
}

export default plugin;
