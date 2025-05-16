// noinspection SpellCheckingInspection

import type {ArtifactInfo, Manifest} from "./type";

/**
 * The Mappings of Mod entries to Gradle dependency declaration.
 * The `{ver}` will be replaced to the version.
 */
const ManifestMapping: Record<string, string> = {
    "GT5-Unofficial": "com.github.NewHorizons:GT5-Unofficial:{ver}",
    "GTNHLib": "com.github.GTNewHorizons:GTNHLib:{ver}",
    "Forgelin": "com.github.NewHorizons:Forgelin:{ver}",
    "AE2FluidCraft-Rework": "com.github.GTNewHorizons:AE2FluidCraft-Rework:{ver}",
    "GTNH-Intergalactic": "com.github.GTNewHorizons:GTNH-Intergalactic:{ver}",
    "NewHorizonsCoreMod": "com.github.GTNewHorizons:NewHorizonsCoreMod:{ver}",
    "Avaritia": "com.github.GTNewHorizons:Avaritia:{ver}",
    "Avaritiaddons": "com.github.GTNewHorizons:Avaritiaddons:{ver}",
    "Eternal-Singularity": "com.github.GTNewHorizons:Eternal-Singularity:{ver}",
    "Universal-Singularities": "com.github.GTNewHorizons:Universal-Singularities:{ver}",
    "MagicBees": "com.github.GTNewHorizons:MagicBees:{ver}",
}

export function gradleDeclareToArtifactInfo(declare: string): ArtifactInfo {
    const [groupId, artifactId, version] = declare.split(":");
    if (!groupId || !artifactId || !version) {
        throw new Error(`Invalid Gradle declaration: ${declare}`);
    }
    return {groupId, artifactId, version};
}

export function gatherDependencies(manifest: Manifest): ArtifactInfo[] {
    const dependencies: ArtifactInfo[] = [];

    Object.entries(manifest.github_mods).forEach(([modName, modInfo]) => {
        const {version} = modInfo;
        const mapping = ManifestMapping[modName];

        if (mapping) {
            dependencies.push(gradleDeclareToArtifactInfo(mapping.replace("{ver}", version)));
            console.debug(`Mapping ${modName} to ${mapping.replace("{ver}", version)}`);
        }
    })

    return dependencies;
}

export function makeIndex() {
    return `
<html lang="en">
<head>
    <title>NewHorizonsBOM</title>
</head>
<body>
    <h1>Hello World!</h1>
    <h2>Supported Mappings</h2>
    ${Object.entries(ManifestMapping).map(([modName, gradleDeclare]) => `<p>${modName}: <pre>${gradleDeclare}</pre></p>`).join("\n")}
</body>
</html>`
}