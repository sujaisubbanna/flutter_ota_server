import { join } from 'path';
import simpleGit, {SimpleGit} from 'simple-git';
import { REPO_URL } from './constants';
const git: SimpleGit = simpleGit();
import * as rmfr from 'rmfr';


export const init = async (branch: string): Promise<string> => {
    const target = join(__dirname, 'repos', 'data');
    const remote = REPO_URL;
    await rmfr.default(target);
    await git.clone(remote, target, ['-b', branch]);
    await git.cwd({ path: target, root: true });
    return await git.revparse('HEAD');
}