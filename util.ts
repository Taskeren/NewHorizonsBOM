import { octokit } from ".";

/**
 * Retrieves a list of file names from the "releases/manifests" folder
 * in the specified GitHub repository using the Octokit client.
 *
 * @returns {Promise<string[]>} A promise that resolves to an array of file names found in the manifest folder.
 *
 * @throws Will throw an error if the GitHub API request fails.
 *
 * @remarks
 * This function assumes that an authenticated instance of Octokit is available in the scope as `octokit`.
 * Only files (not directories or other types) are included in the returned list.
 */
export async function listFilesInManifestFolder(): Promise<string[]> {
    const owner = "GTNewHorizons";
    const repo = "DreamAssemblerXXL";
    const path = "releases/manifests";

    const res = await octokit.repos.getContent({
        owner,
        repo,
        path,
    });

    const ret = []
    if (Array.isArray(res.data)) {
        for (const file of res.data) {
            if (file.type === "file") {
                ret.push(file.name);
            }
        }
    } else {
        console.log("No files found.");
    }

    return ret;
}

/**
 * Retrieves the text content of a file from the "releases/manifests" folder
 * in the specified GitHub repository using the Octokit client.
 *
 * @param {string} fileName - The name of the file to retrieve.
 * @returns {Promise<string>} A promise that resolves to the file's text content.
 *
 * @throws Will throw an error if the GitHub API request fails or the file is not found.
 */
export async function getManifestFileContent(fileName: string): Promise<string> {
    const owner = "GTNewHorizons";
    const repo = "DreamAssemblerXXL";
    const path = `releases/manifests/${fileName}`;

    const res = await octokit.repos.getContent({
        owner,
        repo,
        path,
    });

    if (!("content" in res.data) || typeof res.data.content !== "string") {
        throw new Error("File content not found or invalid format.");
    }

    // GitHub API returns base64-encoded content
    return Buffer.from(res.data.content, "base64").toString("utf-8");
}