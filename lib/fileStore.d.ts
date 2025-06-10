import { MojoContext } from "@mojojs/core";
export interface FileSet {
    field: string;
    fileName: string;
    fileExt: string;
    destinationPath: string;
}
export declare function saveFiles(ctx: MojoContext, destinationPath: string): Promise<FileSet[]>;
