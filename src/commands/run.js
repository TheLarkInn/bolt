// @flow
import Package from '../Package';
import * as options from '../utils/options';
import * as yarn from '../utils/yarn';
import { BoltError } from '../utils/errors';

export type RunOptions = {|
  cwd?: string,
  script: string,
  scriptArgs: options.Args
|};

export function toRunOptions(
  args: options.Args,
  flags: options.Flags
): RunOptions {
  let [script, ...scriptArgs] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    script,
    scriptArgs
  };
}

export async function run(opts: RunOptions) {
  let cwd = opts.cwd || process.cwd();
  let pkg = await Package.closest(cwd);
  let validScript = await yarn.run(pkg, opts.script, opts.scriptArgs);

  if (!validScript) {
    throw new BoltError(
      `Package at "${pkg.dir}" does not have a script named "${opts.script}"`
    );
  }
}
