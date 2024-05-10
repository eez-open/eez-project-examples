import { glob } from "glob";
import { promises as fsPromises } from "fs";
import * as path from "path";

var request = require("request-promise-native");

const EEZ_PROJECT_EXAMPLES_REPOSITORY =
    "https://github.com/eez-open/eez-project-examples";

interface ExampleProject {
    repository: string;
    eezProjectPath: string;
    folder: string;
    projectName: string;

    projectType: string;
    description: string;
    image: string;
    keywords: string;
    displayWidth?: number;
    displayHeight?: number;
    targetPlatform?: string;
    targetPlatformLink?: string;
    resourceFiles: string[];
}

async function getDescription(
    repository: string,
    eezProjectPath: string,
    folder: string,
    json: any
): Promise<ExampleProject | undefined> {
    const projectName = path.basename(eezProjectPath, ".eez-project");

    const projectType = json.settings?.general?.projectType;
    const description = json.settings?.general?.description;
    const image = json.settings?.general?.image;
    const keywords = json.settings?.general?.keywords;
    const displayWidth = json.settings?.general?.displayWidth;
    const displayHeight = json.settings?.general?.displayHeight;
    const targetPlatform = json.settings?.general?.targetPlatform;
    const targetPlatformLink = json.settings?.general?.targetPlatformLink;

    const resourceFiles = [];
    if (json.settings?.general?.resourceFiles) {
        for (const resourceFile of json.settings.general.resourceFiles) {
            if (resourceFile.filePath) {
                resourceFiles.push(resourceFile.filePath);
            }
        }
    }
    if (json.settings?.general?.imports) {
        for (const importDirective of json.settings.general.imports) {
            if (importDirective.projectFilePath) {
                resourceFiles.push(importDirective.projectFilePath);
            }
        }
    }
    if (json.readme?.readmeFile) {
        resourceFiles.push(json.readme?.readmeFile);
    }
    if (projectType == "iext" && json.settings?.general?.scpiDocFolder) {
        resourceFiles.push(
            ...(await getAllFiles(
                __dirname + "/../" + path.dirname(eezProjectPath) + "/" +
                    json.settings.general.scpiDocFolder, json.settings.general.scpiDocFolder + "/"
            ))
        );
    }

    if (description && image && keywords) {
        return {
            repository,
            eezProjectPath,
            folder,
            projectName,

            projectType,
            description,
            image,
            keywords,
            displayWidth,
            displayHeight,
            targetPlatform,
            targetPlatformLink,
            resourceFiles,
        };
    }

    return undefined;
}

async function getAllFiles(dirPath: string, prefix: string): Promise<string[]> {
    const files = await fsPromises.readdir(dirPath);

    const arrayOfFiles: string[] = [];

    for (const file of files) {
        if ((await fsPromises.stat(dirPath + "/" + file)).isDirectory()) {
            arrayOfFiles.push(...(await getAllFiles(dirPath + "/" + file, prefix + file + "/")));
        } else {
            arrayOfFiles.push(prefix + file);
        }
    }

    return arrayOfFiles;
}

export async function getCatalog() {
    const eezProjectfiles = await glob("../examples/**/*.eez-project");

    let catalog: ExampleProject[] = [];

    for (const file of eezProjectfiles) {
        try {
            const jsonStr = await fsPromises.readFile(file, "utf8");
            const json = JSON.parse(jsonStr);

            const projectPath = file
                .replace(/\\/g, "/")
                .substring("../".length);

            const description = await getDescription(
                EEZ_PROJECT_EXAMPLES_REPOSITORY,
                projectPath,
                path.dirname(projectPath).substring("examples/".length),
                json
            );

            if (description) {
                catalog.push(description);
            } else {
                console.warn(
                    `Missing description, image or keywords in ${file}`
                );
            }
        } catch (err) {
            console.error(err);
        }
    }

    const exampleRepositories = require("../example-repositories.json");
    for (const exampleRepository of exampleRepositories) {
        const downloadUrl =
            exampleRepository.url.replace(
                "github.com",
                "raw.githubusercontent.com"
            ) +
            "/master/" +
            exampleRepository.projectPath;

        let projectFile: Buffer = await request({
            method: "GET",
            url: downloadUrl,
            encoding: "utf-8",
        });

        try {
            const jsonStr = projectFile.toString("utf-8");
            const json = JSON.parse(jsonStr);

            const description = await getDescription(
                exampleRepository.url,
                exampleRepository.projectPath,
                exampleRepository.folder,
                json
            );

            if (description) {
                catalog.push(description);
            } else {
                console.warn(
                    `Missing description, image or keywords in ${downloadUrl}`
                );
            }
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    }

    console.log("Number of examples:", catalog.length);

    return catalog;
}
