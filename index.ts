import {Octokit} from "@octokit/rest";
import {getManifestFileContent, listFilesInManifestFolder} from "./util";
import {makeBom, parseManifestFileContent} from "./type";
import {gatherDependencies, makeIndex} from "./mapping";
import {writeFile} from "fs/promises";
import {mkdir} from "fs/promises";
import {dirname} from "path"

console.log("Hello via Bun!");

// load .env file
require("dotenv").config()

export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

async function main() {
    const files = await listFilesInManifestFolder()

    for (let filename of files) {
        // must be JSON
        if (!filename.endsWith(".json")) continue;

        console.log(`Processing ${filename}`);

        const version = filename.substring(0, filename.length - ".json".length)
        const manifest = parseManifestFileContent(await getManifestFileContent(filename));

        const deps = gatherDependencies(manifest)
        const bomText = makeBom(deps, version)

        // output to file
        const outputPath = `releases/com/github/GTNewHorizons/gtnh-bom/${version}/gtnh-bom-${version}.pom`
        await writeFileSmart(outputPath, bomText);
        console.log(`Dumped to ${outputPath}`)
    }

    // output index
    await writeFileSmart("releases/index.html", makeIndex());
}

async function writeFileSmart(file: string, content: string) {
    await mkdir(dirname(file), {recursive: true})
    await writeFile(file, content, {encoding: "utf-8"})
}

// call the main and wait for it
main().then(() => console.log("Done!")).catch((e) => console.error(e));
