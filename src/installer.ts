import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as resolve from './resolve';
import os from 'os';

export async function getJarvis(
  auth: string | undefined,
  version: string,
  arch: string
): Promise<string> {
  const filename = `jarvis_${version}_${resolve.platformName(
    os.platform()
  )}_${arch}`;
  const ghUrl = process.env['GITHUB_SERVER_URL'] || 'https://github.com';
  const downloadUrl = `${ghUrl}/atoscerebro/jarvis/releases/download/v${version}/${filename}`;

  core.info(`attempting to download jarvis from ${downloadUrl}`);
  return await tc.downloadTool(downloadUrl, undefined, auth);
}
