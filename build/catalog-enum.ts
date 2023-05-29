import { glob } from "glob";
import { promises as fsPromises } from "fs";
import { basename } from "path";

export async function getCatalog() {
    const eezProjectfiles = await glob("../examples/**/*.eez-project");

    let catalog: {
        name: string;
        type: string;
        path: string;
        description: string;
        image: string;
        keywords: string[];
        displayWidth?: number;
        displayHeight?: number;
        targetPlatform?: string;
        targetPlatformLink?: string;
    }[] = [];

    for (const file of eezProjectfiles) {
        try {
            const jsonStr = await fsPromises.readFile(file, "utf8");
            const json = JSON.parse(jsonStr);

            const name = basename(file, ".eez-project");
            const type = json.settings?.general?.projectType;
            const path = file.replace(/\\/g, "/").substring("../examples/".length);
            const description = json.settings?.general?.description;
            const image = json.settings?.general?.image;
            const keywords = json.settings?.general?.keywords;
            const displayWidth = json.settings?.general?.displayWidth;
            const displayHeight = json.settings?.general?.displayHeight;
            const targetPlatform = json.settings?.general?.targetPlatform;
            const targetPlatformLink = json.settings?.general?.targetPlatformLink;

            if (description && image && keywords) {
                catalog.push({
                    name,
                    type,
                    path,
                    description,
                    image,
                    keywords,
                    displayWidth,
                    displayHeight,
                    targetPlatform,
                    targetPlatformLink
                });
            } else {
                console.warn(`Missing description, image or keywords in ${file}`);
            }
        } catch (err) {
            console.error(err);
        }
    }

    console.log("Number of examples:", catalog.length);

    return catalog;
}
