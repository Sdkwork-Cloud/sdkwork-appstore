$root = "E:\sdkwork-space\sdkwork-appstore"
$deps = @"
sdkwork-web-core = { path = "../../../sdkwork-web-framework/crates/sdkwork-web-core" }
axum = { version = "0.8", default-features = false, features = ["json"] }
sdkwork-iam-web-adapter = { path = "../../../sdkwork-appbase/crates/sdkwork-iam-web-adapter" }
sdkwork-web-axum = { path = "../../../sdkwork-web-framework/crates/sdkwork-web-axum" }

[dev-dependencies]
sdkwork-web-core = { path = "../../../sdkwork-web-framework/crates/sdkwork-web-core" }
"@

function Update-Crate($crateName, $surface) {
  $crateDir = Join-Path $root "crates\$crateName"
  $lib = Join-Path $crateDir "src\lib.rs"
  $cargo = Join-Path $crateDir "Cargo.toml"
  $testDir = Join-Path $crateDir "tests"
  $manifestFn = if ($surface -eq "app") { "app_route_manifest" } else { "backend_route_manifest" }
  $testName = if ($surface -eq "app") { "app_route_manifest_matches_route_definitions" } else { "backend_route_manifest_matches_route_definitions" }

  $libText = Get-Content $lib -Raw
  if ($libText -notmatch "http_route_manifest") {
    $libText = $libText -replace "pub mod routes;", "pub mod http_route_manifest;`r`npub mod routes;`r`npub mod web_bootstrap;"
    $export = @"

pub use http_route_manifest::$manifestFn;
pub use web_bootstrap::{
    appstore_${surface}_api_prefixes, appstore_${surface}_api_public_path_prefixes,
    wrap_router_with_web_framework, wrap_router_with_web_framework_from_env,
};
"@
    if ($surface -eq "app") {
      $export = @"

pub use http_route_manifest::app_route_manifest;
pub use web_bootstrap::{
    appstore_app_api_prefixes, appstore_app_api_public_path_prefixes,
    wrap_router_with_web_framework, wrap_router_with_web_framework_from_env,
};
"@
    } else {
      $export = @"

pub use http_route_manifest::backend_route_manifest;
pub use web_bootstrap::{
    appstore_backend_api_prefixes, appstore_backend_api_public_path_prefixes,
    wrap_router_with_web_framework, wrap_router_with_web_framework_from_env,
};
"@
    }
    $libText = $libText.TrimEnd() + $export + "`r`n"
    Set-Content $lib $libText -NoNewline
  }

  $cargoText = Get-Content $cargo -Raw
  if ($cargoText -notmatch "sdkwork-web-core") {
    Set-Content $cargo ($cargoText.TrimEnd() + "`r`n" + $deps + "`r`n") -NoNewline
  }

  New-Item -ItemType Directory -Force -Path $testDir | Out-Null
  $crateRust = $crateName -replace '-','_'
  $test = @"
use ${crateRust}::{${manifestFn}, route_definitions};
use sdkwork_web_core::RouteAuth;

#[test]
fn ${testName}() {
    let manifest = ${manifestFn}();
    for entry in route_definitions() {
        let matched = manifest
            .match_route(entry.method, entry.path)
            .unwrap_or_else(|| {
                panic!(
                    "missing http route manifest for {} {}",
                    entry.method, entry.path
                )
            });
        assert_eq!(matched.auth, RouteAuth::DualToken);
        assert_eq!(matched.operation_id, entry.operation_id);
    }
}
"@
  Set-Content (Join-Path $testDir "route_manifest.rs") $test -NoNewline
}

$appCrates = @(
  "sdkwork-router-catalog-app-api",
  "sdkwork-router-compliance-app-api",
  "sdkwork-router-library-app-api",
  "sdkwork-router-publisher-app-api",
  "sdkwork-router-release-app-api",
  "sdkwork-router-listing-app-api"
)
$backendCrates = @(
  "sdkwork-router-catalog-backend-api",
  "sdkwork-router-listing-backend-api",
  "sdkwork-router-publisher-backend-api",
  "sdkwork-router-moderation-backend-api",
  "sdkwork-router-market-backend-api",
  "sdkwork-router-metrics-backend-api"
)
foreach ($c in $appCrates) { Update-Crate $c "app" }
foreach ($c in $backendCrates) { Update-Crate $c "backend" }
