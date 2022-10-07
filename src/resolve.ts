import * as core from '@actions/core';
import * as httpm from '@actions/http-client';
import { OutgoingHttpHeaders } from 'http2';
import * as semver from 'semver';

export function archName(arch: string): string {
  core.info('resolving architecture');

  const mapping: Record<string, string> = {
    x32: '386',
    x64: 'amd64',
  };
  const resolved = mapping[arch] || arch;
  core.info(`resolved as ${resolved}`);

  return resolved;
}

export function platformName(plat: string): string {
  core.info('resolving platform');

  const mapping: Record<string, string> = {
    win32: 'windows',
  };
  const resolved = mapping[plat] || plat;
  core.info(`resolved as ${resolved}`);

  return resolved;
}

interface ITag {
  name: string;
}

export async function latestVersion(auth: string | undefined): Promise<string> {
  core.info('attempting to resolve latest version');

  const ghApi = process.env['GITHUB_API_URL'] || 'https://api.github.com';
  const tagsUrl = `${ghApi}/repos/atoscerebro/jarvis/tags`;
  const headers: OutgoingHttpHeaders = {};

  const http = new httpm.HttpClient('setup-jarvis');
  if (auth) {
    core.debug('set auth');
    headers.authorization = auth;
  }

  const response = await http.getJson<ITag[]>(tagsUrl, headers);
  if (!response.result || response.result.length === 0) {
    core.error(`failed to find tags for jarvis repo @ ${tagsUrl}`);
    return '';
  }

  const tags = response.result.sort((a, b) => semver.compare(a.name, b.name));
  const resolved = semver.clean(tags[0].name);

  if (resolved) {
    core.info(`resolved as ${resolved}`);
    return resolved;
  } else {
    return '';
  }
}
