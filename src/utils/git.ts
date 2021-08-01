import { join } from 'path';
import simpleGit, { SimpleGit } from 'simple-git';
import { REPO_URL } from './constants';
const git: SimpleGit = simpleGit();
import * as rmfr from 'rmfr';
import { spawnSafeSync } from './spawnSafe';
import * as fs from 'fs';
import { DiffMatchPatch } from 'diff-match-patch-typescript';
import { FileDiff } from '../models/file-diff.interface';
const diffPatch = new DiffMatchPatch();

export const init = async (branch: string): Promise<string> => {
    const target = join(__dirname, 'data');
    const remote = REPO_URL;
    await rmfr.default(target);
    spawnSafeSync(`mkdir`, ['data'], {
        cwd: __dirname,
        stdio: "ignore",
    })
    spawnSafeSync(`git`, ['clone', '--branch', branch, remote, target], {
        cwd: __dirname,
        stdio: "ignore",
    })
    return target;
}

export const getFirstCommit = async (target: string) => {
    const result = spawnSafeSync(`git`, ['rev-list', '--max-parents=0', 'HEAD'], {
        cwd: target,
        stdio: "pipe",
    });
    return result.stdout.toString('utf-8').trim();
}

export const diff = async (target: string, currentCommit: string): Promise<{
    diff: FileDiff[], latestCommit: string
}> => {
    await git.cwd({ path: target, root: true });
    const latestCommit = await git.revparse('HEAD');
    if (latestCommit === currentCommit) {
        return { diff: [], latestCommit };
    }
    const gitDiff = await git.diffSummary(["--no-color",
        "--ignore-space-at-eol",
        "--no-ext-diff", currentCommit, latestCommit]);
    const diffs = await Promise.all(gitDiff.files.map(async (x) => {
        const oldFile = await git.show([`${currentCommit}:./${x.file}`]);
        const newFile = fs.readFileSync(`${target}/${x.file}`, 'utf-8');
        const patches = diffPatch.patch_make(oldFile, newFile);
        const diffResult = new FileDiff(x.file, diffPatch.patch_toText(patches));
        return diffResult;
    }));
    return { diff: diffs, latestCommit };
}

export const cleanUp = async (target: string): Promise<void> => {
    await rmfr.default(target);
}


