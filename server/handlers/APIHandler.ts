import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const APICache = new Map<string, any>();

async function loadAPI(apiName: string) {
    if (APICache.has(apiName)) {
        return APICache.get(apiName);
    }

    const filePathArr = apiName.split("_");

    let apiPath = path.join(process.cwd(), "API", ...filePathArr);

    if (fs.existsSync(apiPath + ".ts")) {
        apiPath += ".ts";

    } else  {
        throw new Error(`API module not found: ${apiName}`);
    }

    const apiModule = await import(pathToFileURL(apiPath).href);
    const handler = apiModule.handler;

    if (typeof handler !== "function") {
        throw new Error(`API module ${apiName} does not export a handler function`);
    }

    APICache.set(apiName, handler);
    return handler;
}

export async function callAPI(apiName: string, data: any) {
    const handler = await loadAPI(apiName);
    return await handler(data);
}
