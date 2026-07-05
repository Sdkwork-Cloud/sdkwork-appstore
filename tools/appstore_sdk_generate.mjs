import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const generate = process.argv.includes("--generate");

const targets = [
  {
    manifestPath: "sdks/sdkwork-appstore-sdk/sdk-manifest.json",
    materializedOpenApiPath:
      "sdks/sdkwork-appstore-sdk/openapi/sdkwork-appstore-open-api.openapi.yaml",
    expected: {
      sdkOwner: "sdkwork-appstore",
      apiAuthority: "sdkwork-appstore-open-api",
      sdkFamily: "sdkwork-appstore-sdk",
      generationInputSpec: "../../apis/open-api/store/openapi.yaml",
      apiPrefix: "/store/v3/api",
    },
  },
  {
    manifestPath: "sdks/sdkwork-appstore-app-sdk/sdk-manifest.json",
    materializedOpenApiPath:
      "sdks/sdkwork-appstore-app-sdk/openapi/sdkwork-appstore-app-api.openapi.yaml",
    expected: {
      sdkOwner: "sdkwork-appstore",
      apiAuthority: "sdkwork-appstore-app-api",
      sdkFamily: "sdkwork-appstore-app-sdk",
      generationInputSpec: "../../apis/app-api/store/openapi.yaml",
      apiPrefix: "/app/v3/api",
    },
  },
  {
    manifestPath: "sdks/sdkwork-appstore-backend-sdk/sdk-manifest.json",
    materializedOpenApiPath:
      "sdks/sdkwork-appstore-backend-sdk/openapi/sdkwork-appstore-backend-api.openapi.yaml",
    expected: {
      sdkOwner: "sdkwork-appstore",
      apiAuthority: "sdkwork-appstore-backend-api",
      sdkFamily: "sdkwork-appstore-backend-sdk",
      generationInputSpec: "../../apis/backend-api/store/openapi.yaml",
      apiPrefix: "/backend/v3/api",
    },
  },
];

for (const target of targets) {
  const manifest = JSON.parse(await readFile(resolve(target.manifestPath), "utf8"));
  for (const [key, expectedValue] of Object.entries(target.expected)) {
    if (manifest[key] !== expectedValue) {
      throw new Error(
        `${target.manifestPath} ${key} must be ${expectedValue}, got ${manifest[key]}`,
      );
    }
  }

  const manifestDir = dirname(resolve(target.manifestPath));
  const authoredOpenApi = await readFile(resolve(manifestDir, manifest.generationInputSpec), "utf8");
  const materializedOpenApi = await readFile(resolve(target.materializedOpenApiPath), "utf8");
  if (authoredOpenApi !== materializedOpenApi) {
    throw new Error(`${target.materializedOpenApiPath} is stale; run pnpm run api:materialize`);
  }

  console.log(`sdkgen input verified for ${target.manifestPath}`);
}

if (generate) {
  execFileSync(process.execPath, [resolve("tools/appstore_openapi_materialize.mjs")], {
    stdio: "inherit",
  });
  console.log("sdk:generate completed (OpenAPI materialized; run workspace SDK generator when wired)");
}
