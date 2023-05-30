import { glob } from "glob";
import { promises as fsPromises } from "fs";
import { basename, dirname } from "path";

var request = require("request-promise-native");

function getDescription(json: any, name: string, path: string, url?: string) {
    const type = json.settings?.general?.projectType;
    const folder = dirname(path);
    const description = json.settings?.general?.description;
    const image = json.settings?.general?.image;
    const keywords = json.settings?.general?.keywords;
    const displayWidth = json.settings?.general?.displayWidth;
    const displayHeight = json.settings?.general?.displayHeight;
    const targetPlatform = json.settings?.general?.targetPlatform;
    const targetPlatformLink = json.settings?.general?.targetPlatformLink;

    if (description && image && keywords) {
        return {
            url,
            name,
            type,
            path,
            folder,
            description,
            image,
            keywords,
            displayWidth,
            displayHeight,
            targetPlatform,
            targetPlatformLink,
            resourceFiles: json.settings?.resources?.files || [],
        };
    }

    return undefined;
}

export async function getCatalog() {
    const eezProjectfiles = await glob("../examples/**/*.eez-project");

    let catalog: {
        url?: string;
        name: string;
        type: string;
        path: string;
        folder: string;
        description: string;
        image: string;
        keywords: string[];
        displayWidth?: number;
        displayHeight?: number;
        targetPlatform?: string;
        targetPlatformLink?: string;
        resourceFiles: string[];
    }[] = [];

    for (const file of eezProjectfiles) {
        try {
            const jsonStr = await fsPromises.readFile(file, "utf8");
            const json = JSON.parse(jsonStr);

            const description = getDescription(
                json,
                basename(file, ".eez-project"),
                file.replace(/\\/g, "/").substring("../examples/".length)
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

        console.log(downloadUrl);

        let projectFile: Buffer = await request({
            method: "GET",
            url: downloadUrl,
            encoding: "utf-8",
        });

        try {
            const jsonStr = projectFile.toString("utf-8");
            const json = JSON.parse(jsonStr);

            const description = getDescription(
                json,
                basename(exampleRepository.projectPath, ".eez-project"),
                exampleRepository.projectPath,
                exampleRepository.url
            );

            if (description) {
                catalog.push(description);
            } else {
                console.warn(
                    `Missing description, image or keywords in ${exampleRepository.url}`
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
