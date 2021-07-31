export class FileDiff {
    file: string;
    patches: string;

    constructor(file: string, patches: string) {
        this.file = file;
        this.patches = patches;
    }
}