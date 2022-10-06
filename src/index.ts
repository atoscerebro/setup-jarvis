import * as core from '@actions/core';
import * as semver from 'semver';
import * as installer from './installer';
import * as resolve from './resolve';
import os from 'os';

async function setup() {
  try {
    const token = core.getInput('token');
    core.setSecret(token);
    const auth = !token ? undefined : `token ${token}`;
    if (auth) {
      core.setSecret(auth);
    }

    let version: string = core.getInput('version');
    const clean = semver.clean(version);
    if (clean) {
      version = clean;
    }
    if (!version || version === 'latest') {
      const resolved = await resolve.latestVersion(auth);
      if (resolved === '') {
        throw new Error('unable to resolve latest version of jarvis')
      }
      version = resolved;
    }

    let arch = core.getInput('architecture');
    if (!arch) {
      arch = os.arch();
    }
    arch = resolve.archName(arch);

    const pathToBinary = await installer.getJarvis(auth, version, arch);
    core.addPath(pathToBinary);

  } catch (e: any) {
    let message = "something went wrong";

    if (e instanceof Error) {
      message = e.message;
    } else {
      core.info(e.toString());
    }
    core.setFailed(message);
  }
}

if (require.main === module) {
  setup();
}
