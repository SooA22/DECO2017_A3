import path from 'node:path';
import { mkdir } from "node:fs/promises";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
export async function saveFiles(ctx, destinationPath) {
    // Ensure destination path exists
    await mkdir(destinationPath, { recursive: true });
    const fileSet = [];
    for await (const file of ctx.req.files()) {
        // console.debug(file);
        const metadata = {
            field: file.fieldname,
            fileName: file.filename,
            fileExt: path.extname(file.filename),
            destinationPath: ''
        };
        metadata.destinationPath = path.join(destinationPath, `${randomUUID()}${metadata.fileExt}`);
        fileSet.push(metadata);
        // console.debug(metadata)
        const writableStream = fs.createWriteStream(metadata.destinationPath);
        file.file.pipe(writableStream);
    }
    return fileSet;
}
//# sourceMappingURL=fileStore.js.map