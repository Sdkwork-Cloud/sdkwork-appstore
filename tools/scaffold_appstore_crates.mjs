import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const serviceCapabilities = [
  "publisher",
  "listing",
  "release",
  "catalog",
  "library",
  "moderation",
  "compliance",
];

const routeCrates = [
  {
    capability: "catalog",
    surface: "app-api",
    prefix: "/app/v3/api",
    routes: [
      ["GET", "/app/v3/api/catalog/home", "appstore.catalog.home.retrieve"],
      ["GET", "/app/v3/api/catalog/categories", "appstore.catalog.categories.list"],
      ["GET", "/app/v3/api/catalog/listings/search", "appstore.catalog.listings.search"],
    ],
  },
  {
    capability: "listing",
    surface: "app-api",
    prefix: "/app/v3/api",
    routes: [
      ["POST", "/app/v3/api/listings", "appstore.listings.create"],
      ["GET", "/app/v3/api/listings/{listingId}", "appstore.listings.retrieve"],
      ["POST", "/app/v3/api/listings/{listingId}/submissions", "appstore.listings.submissions.create"],
    ],
  },
  {
    capability: "release",
    surface: "app-api",
    prefix: "/app/v3/api",
    routes: [
      ["POST", "/app/v3/api/listings/{listingId}/releases", "appstore.releases.create"],
      ["GET", "/app/v3/api/releases/{releaseId}", "appstore.releases.retrieve"],
      ["POST", "/app/v3/api/releases/{releaseId}/artifacts", "appstore.releases.artifacts.attach"],
    ],
  },
  {
    capability: "library",
    surface: "app-api",
    prefix: "/app/v3/api",
    routes: [
      ["GET", "/app/v3/api/library/items", "appstore.library.items.list"],
      ["POST", "/app/v3/api/library/install", "appstore.library.install"],
      ["POST", "/app/v3/api/download_grants", "appstore.downloadGrants.create"],
    ],
  },
  {
    capability: "publisher",
    surface: "app-api",
    prefix: "/app/v3/api",
    routes: [
      ["GET", "/app/v3/api/publishers/me", "appstore.publishers.me.retrieve"],
      ["POST", "/app/v3/api/publishers", "appstore.publishers.create"],
      ["POST", "/app/v3/api/publishers/{publisherId}/verifications", "appstore.publishers.verifications.submit"],
    ],
  },
  {
    capability: "compliance",
    surface: "app-api",
    prefix: "/app/v3/api",
    routes: [
      ["GET", "/app/v3/api/listings/{listingId}/compliance", "appstore.compliance.profile.retrieve"],
      ["PUT", "/app/v3/api/listings/{listingId}/compliance", "appstore.compliance.profile.update"],
      ["PUT", "/app/v3/api/listings/{listingId}/compliance/permissions", "appstore.compliance.permissions.update"],
    ],
  },
  {
    capability: "moderation",
    surface: "backend-api",
    prefix: "/backend/v3/api",
    routes: [
      ["GET", "/backend/v3/api/moderation/queue", "appstore.moderation.queue.list"],
      ["POST", "/backend/v3/api/moderation/reviews/{reviewId}/assign", "appstore.moderation.reviews.assign"],
      ["POST", "/backend/v3/api/moderation/reviews/{reviewId}/decisions", "appstore.moderation.decisions.create"],
    ],
  },
  {
    capability: "catalog",
    surface: "backend-api",
    prefix: "/backend/v3/api",
    routes: [
      ["POST", "/backend/v3/api/catalog/collections", "appstore.catalog.collections.create"],
      ["PUT", "/backend/v3/api/catalog/collections/{collectionId}/items", "appstore.catalog.collections.items.upsert"],
      ["PUT", "/backend/v3/api/catalog/featured/{slotCode}", "appstore.catalog.featured.upsert"],
    ],
  },
  {
    capability: "listing",
    surface: "backend-api",
    prefix: "/backend/v3/api",
    routes: [
      ["GET", "/backend/v3/api/listings", "appstore.listings.admin.list"],
      ["GET", "/backend/v3/api/listings/{listingId}", "appstore.listings.admin.retrieve"],
      ["PATCH", "/backend/v3/api/listings/{listingId}/visibility", "appstore.listings.admin.visibility.update"],
    ],
  },
  {
    capability: "publisher",
    surface: "backend-api",
    prefix: "/backend/v3/api",
    routes: [
      ["POST", "/backend/v3/api/publishers/{publisherId}/verify", "appstore.publishers.admin.verify"],
    ],
  },
  {
    capability: "metrics",
    surface: "backend-api",
    prefix: "/backend/v3/api",
    routes: [
      ["GET", "/backend/v3/api/metrics/listings/{listingId}", "appstore.metrics.listings.retrieve"],
    ],
  },
  {
    capability: "release",
    surface: "open-api",
    prefix: "/store/v3/api",
    routes: [
      ["POST", "/store/v3/api/releases/check_update", "appstore.releases.checkUpdate"],
      ["GET", "/store/v3/api/releases/{releaseId}", "appstore.releases.public.retrieve"],
      ["POST", "/store/v3/api/artifacts/resolve_download", "appstore.artifacts.resolveDownload"],
    ],
  },
  {
    capability: "catalog",
    surface: "open-api",
    prefix: "/store/v3/api",
    routes: [
      ["GET", "/store/v3/api/catalog/featured", "appstore.catalog.public.featured.list"],
    ],
  },
  {
    capability: "listing",
    surface: "open-api",
    prefix: "/store/v3/api",
    routes: [
      ["GET", "/store/v3/api/listings/{listingSlug}", "appstore.listings.public.retrieve"],
    ],
  },
  {
    capability: "automation",
    surface: "open-api",
    prefix: "/store/v3/api",
    routes: [
      ["POST", "/store/v3/api/automation/submissions", "appstore.publish.automation.submissions.create"],
    ],
  },
];

const tableNames = [
  "appstore_idempotency_key",
  "appstore_publisher",
  "appstore_publisher_member",
  "appstore_publisher_verification",
  "appstore_app",
  "appstore_app_dependency",
  "appstore_category",
  "appstore_category_localization",
  "appstore_tag",
  "appstore_tag_localization",
  "appstore_listing",
  "appstore_listing_localization",
  "appstore_listing_media",
  "appstore_listing_category_binding",
  "appstore_listing_tag_binding",
  "appstore_regional_availability",
  "appstore_compliance_profile",
  "appstore_compliance_permission_disclosure",
  "appstore_release_channel",
  "appstore_release",
  "appstore_release_note_localization",
  "appstore_release_artifact",
  "appstore_release_rollout",
  "appstore_market_channel",
  "appstore_market_release",
  "appstore_listing_submission",
  "appstore_moderation_review",
  "appstore_moderation_decision",
  "appstore_catalog_collection",
  "appstore_catalog_collection_localization",
  "appstore_catalog_collection_item",
  "appstore_catalog_featured_slot",
  "appstore_catalog_chart_snapshot",
  "appstore_user_library_item",
  "appstore_user_wishlist_item",
  "appstore_entitlement",
  "appstore_download_grant",
  "appstore_install_event",
  "appstore_listing_metric_snapshot",
];

function pascalCase(value) {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function snakeCase(value) {
  return value.replaceAll("-", "_");
}

async function write(relativePath, content) {
  const target = join(root, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content.replace(/\n/g, "\r\n"));
}

function cargoToml(packageName, extra = "") {
  return `[package]
name = "${packageName}"
version = "0.1.0"
edition = "2021"

[lib]
path = "src/lib.rs"
${extra}`;
}

function crateReadme(packageName, responsibility, nextSteps) {
  return `# ${packageName}

${responsibility}

## Boundary

- Owns only this crate's SDKWork responsibility.
- Must preserve authored OpenAPI, database registry, and SDK family boundaries.
- Must not call raw HTTP, parse credential headers manually, or bypass generated/dependency SDKs.

## Handoff TODO

${nextSteps.map((item) => `- TODO(appstore-implementation): ${item}`).join("\n")}
`;
}

function serviceCrate(capability) {
  const crateName = `sdkwork-appstore-${capability}-service`;
  const typePrefix = pascalCase(capability);
  const serviceType = `${typePrefix}Service`;
  return {
    name: crateName,
    files: {
      [`crates/${crateName}/Cargo.toml`]: cargoToml(crateName),
      [`crates/${crateName}/README.md`]: crateReadme(
        crateName,
        `Business service/use-case crate for App Store ${capability} workflows.`,
        [
          `implement ${capability} authorization and tenant/data-scope policy`,
          `translate OpenAPI commands into ${capability} domain commands`,
          `coordinate idempotency, repository transactions, and appstore.store.* events`,
        ],
      ),
      [`crates/${crateName}/src/lib.rs`]: `//! App Store ${capability} service boundary.

pub mod context;
pub mod domain;
pub mod error;
pub mod ports;
pub mod service;

pub use context::AppstoreRequestContext;
pub use error::{AppstoreServiceError, AppstoreServiceResult};
pub use service::${capability}_service::${serviceType};

pub const CAPABILITY: &str = "${capability}";

pub fn capability_name() -> &'static str {
    CAPABILITY
}
`,
      [`crates/${crateName}/src/context.rs`]: `//! Typed request context accepted by the ${capability} service.

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AppstoreRequestContext {
    pub tenant_id: String,
    pub organization_id: Option<String>,
    pub user_id: Option<String>,
    pub request_id: String,
}

impl AppstoreRequestContext {
    pub fn tenant_scoped(tenant_id: impl Into<String>, request_id: impl Into<String>) -> Self {
        Self {
            tenant_id: tenant_id.into(),
            organization_id: None,
            user_id: None,
            request_id: request_id.into(),
        }
    }
}
`,
      [`crates/${crateName}/src/error.rs`]: `//! ${typePrefix} service errors.

use std::fmt::{Display, Formatter};

pub type AppstoreServiceResult<T> = Result<T, AppstoreServiceError>;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum AppstoreServiceError {
    NotImplemented(&'static str),
}

impl Display for AppstoreServiceError {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NotImplemented(message) => formatter.write_str(message),
        }
    }
}

impl std::error::Error for AppstoreServiceError {}
`,
      [`crates/${crateName}/src/domain/mod.rs`]: `//! ${typePrefix} domain model boundary.

pub mod commands;
pub mod events;
pub mod models;
pub mod results;
`,
      [`crates/${crateName}/src/domain/models.rs`]: `//! ${typePrefix} aggregate placeholders.

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ${typePrefix}Id(pub String);

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ${typePrefix}Record {
    pub id: ${typePrefix}Id,
    pub tenant_id: String,
    pub status: String,
}
`,
      [`crates/${crateName}/src/domain/commands.rs`]: `//! ${typePrefix} command placeholders.

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Plan${typePrefix}Command {
    pub idempotency_key: Option<String>,
}
`,
      [`crates/${crateName}/src/domain/results.rs`]: `//! ${typePrefix} result placeholders.

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Plan${typePrefix}Result {
    pub accepted: bool,
    pub todo: &'static str,
}
`,
      [`crates/${crateName}/src/domain/events.rs`]: `//! ${typePrefix} domain event placeholders.

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ${typePrefix}DomainEvent {
    pub event_type: &'static str,
}
`,
      [`crates/${crateName}/src/ports/mod.rs`]: `//! ${typePrefix} service ports.

pub mod events;
pub mod provider;
pub mod repository;
`,
      [`crates/${crateName}/src/ports/repository.rs`]: `//! Repository port for ${capability} use cases.

pub trait ${typePrefix}Repository {
    fn port_name(&self) -> &'static str {
        "TODO(appstore-implementation): implement ${capability} repository port"
    }
}
`,
      [`crates/${crateName}/src/ports/provider.rs`]: `//! Dependency provider ports for ${capability} use cases.

pub trait ${typePrefix}ProviderPort {
    fn port_name(&self) -> &'static str {
        "TODO(appstore-implementation): inject SDKWork dependency SDK/provider adapters"
    }
}
`,
      [`crates/${crateName}/src/ports/events.rs`]: `//! Event publication port for ${capability} use cases.

pub trait ${typePrefix}EventPublisher {
    fn port_name(&self) -> &'static str {
        "TODO(appstore-implementation): publish appstore.store.* events through outbox"
    }
}
`,
      [`crates/${crateName}/src/service/mod.rs`]: `//! ${typePrefix} service modules.

pub mod ${capability}_service;
`,
      [`crates/${crateName}/src/service/${capability}_service.rs`]: `//! ${typePrefix} service entrypoint.

use crate::context::AppstoreRequestContext;
use crate::domain::commands::Plan${typePrefix}Command;
use crate::domain::results::Plan${typePrefix}Result;
use crate::error::{AppstoreServiceError, AppstoreServiceResult};

#[derive(Debug, Default, Clone)]
pub struct ${serviceType};

impl ${serviceType} {
    pub fn plan_module(
        &self,
        context: &AppstoreRequestContext,
        command: Plan${typePrefix}Command,
    ) -> AppstoreServiceResult<Plan${typePrefix}Result> {
        let _ = (context, command);
        Err(AppstoreServiceError::NotImplemented(
            "TODO(appstore-implementation): implement ${capability} service use cases",
        ))
    }
}
`,
    },
  };
}

function routeCrate(config) {
  const { capability, surface, prefix, routes } = config;
  const crateName = `sdkwork-router-${capability}-${surface}`;
  const typePrefix = `${pascalCase(capability)}${pascalCase(surface)}`;
  const authority =
    surface === "app-api"
      ? "sdkwork-appstore-app-api"
      : surface === "backend-api"
        ? "sdkwork-appstore-backend-api"
        : "sdkwork-appstore-open-api";
  const sdkFamily =
    surface === "app-api"
      ? "sdkwork-appstore-app-sdk"
      : surface === "backend-api"
        ? "sdkwork-appstore-backend-sdk"
        : "sdkwork-appstore-sdk";
  const routeItems = routes
    .map(
      ([method, path, operationId]) => `    RouteDefinition {
        method: "${method}",
        path: "${path}",
        operation_id: "${operationId}",
    },`,
    )
    .join("\n");

  return {
    name: crateName,
    files: {
      [`crates/${crateName}/Cargo.toml`]: cargoToml(crateName),
      [`crates/${crateName}/README.md`]: crateReadme(
        crateName,
        `Rust HTTP route adapter skeleton for ${capability} ${surface} operations.`,
        [
          "replace route descriptors with the selected Rust HTTP framework router builder",
          "map requests and responses against authored OpenAPI schemas",
          "delegate all business decisions to service crates and typed request context",
        ],
      ),
      [`crates/${crateName}/src/lib.rs`]: `//! Route crate skeleton for ${capability} ${surface}.

pub mod error;
pub mod handlers;
pub mod manifest;
pub mod mapper;
pub mod paths;
pub mod routes;

pub use manifest::{route_manifest, RouteManifest};
pub use routes::{route_definitions, RouteDefinition};
`,
      [`crates/${crateName}/src/paths.rs`]: `//! Canonical path constants for ${capability} ${surface}.

pub const CAPABILITY: &str = "${capability}";
pub const SURFACE: &str = "${surface}";
pub const PREFIX: &str = "${prefix}";
pub const API_AUTHORITY: &str = "${authority}";
pub const SDK_FAMILY: &str = "${sdkFamily}";
`,
      [`crates/${crateName}/src/routes.rs`]: `//! Route registration descriptors for ${capability} ${surface}.

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteDefinition {
    pub method: &'static str,
    pub path: &'static str,
    pub operation_id: &'static str,
}

pub const ROUTES: &[RouteDefinition] = &[
${routeItems}
];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
`,
      [`crates/${crateName}/src/handlers.rs`]: `//! HTTP handler boundary for ${capability} ${surface}.

pub fn handler_boundary_name() -> &'static str {
    "TODO(appstore-implementation): implement ${capability} ${surface} handlers"
}
`,
      [`crates/${crateName}/src/manifest.rs`]: `//! Route manifest projection for ${capability} ${surface}.

use crate::paths::{API_AUTHORITY, CAPABILITY, PREFIX, SDK_FAMILY, SURFACE};
use crate::routes::{route_definitions, RouteDefinition};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteManifest {
    pub kind: &'static str,
    pub package_name: &'static str,
    pub owner: &'static str,
    pub domain: &'static str,
    pub capability: &'static str,
    pub surface: &'static str,
    pub prefix: &'static str,
    pub api_authority: &'static str,
    pub sdk_family: &'static str,
    pub routes: &'static [RouteDefinition],
}

pub fn route_manifest() -> RouteManifest {
    RouteManifest {
        kind: "sdkwork.route.manifest",
        package_name: "${crateName}",
        owner: "sdkwork-appstore",
        domain: "appstore",
        capability: CAPABILITY,
        surface: SURFACE,
        prefix: PREFIX,
        api_authority: API_AUTHORITY,
        sdk_family: SDK_FAMILY,
        routes: route_definitions(),
    }
}
`,
      [`crates/${crateName}/src/error.rs`]: `//! Problem-detail mapping placeholder for ${capability} ${surface}.

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ${typePrefix}RouteError {
    pub message: &'static str,
}
`,
      [`crates/${crateName}/src/mapper/mod.rs`]: `//! Request/response/problem mappers for ${capability} ${surface}.

pub mod problem;
pub mod request;
pub mod response;
`,
      [`crates/${crateName}/src/mapper/request.rs`]: `//! Request mapper placeholder.

pub fn request_mapper_todo() -> &'static str {
    "TODO(appstore-implementation): map OpenAPI request DTOs to service commands"
}
`,
      [`crates/${crateName}/src/mapper/response.rs`]: `//! Response mapper placeholder.

pub fn response_mapper_todo() -> &'static str {
    "TODO(appstore-implementation): map service results to OpenAPI response DTOs"
}
`,
      [`crates/${crateName}/src/mapper/problem.rs`]: `//! Problem-detail mapper placeholder.

pub fn problem_mapper_todo() -> &'static str {
    "TODO(appstore-implementation): map service errors to SDKWork problem details"
}
`,
    },
  };
}

function apiServerCrate() {
  const name = "sdkwork-appstore-api-server";
  return {
    name,
    files: {
      [`crates/${name}/Cargo.toml`]: `${cargoToml(name)}
[[bin]]
name = "sdkwork-appstore-api-server"
path = "src/main.rs"
`,
      [`crates/${name}/README.md`]: crateReadme(
        name,
        "Runnable HTTP process skeleton for mounting appstore route crates.",
        [
          "choose and wire the Rust HTTP framework",
          "construct service host, repositories, dependency adapters, and route crates",
          "add startup preflight for database migrations and dependency SDK surfaces",
        ],
      ),
      [`crates/${name}/src/lib.rs`]: `//! SDKWork App Store API server skeleton.

pub mod bootstrap;
pub mod health;
pub mod preflight;
pub mod server;
`,
      [`crates/${name}/src/main.rs`]: `fn main() {
    println!("{}", sdkwork_appstore_api_server::server::planned_listener_name());
}
`,
      [`crates/${name}/src/bootstrap/mod.rs`]: `//! API server bootstrap modules.

pub mod config;
pub mod routers;
pub mod state;
`,
      [`crates/${name}/src/bootstrap/config.rs`]: `//! API server configuration placeholder.

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ApiServerConfig {
    pub app_api_bind: String,
    pub backend_api_bind: String,
    pub open_api_bind: String,
}

impl Default for ApiServerConfig {
    fn default() -> Self {
        Self {
            app_api_bind: "127.0.0.1:18090".to_string(),
            backend_api_bind: "127.0.0.1:18091".to_string(),
            open_api_bind: "127.0.0.1:18092".to_string(),
        }
    }
}
`,
      [`crates/${name}/src/bootstrap/state.rs`]: `//! Shared API server state placeholder.

#[derive(Debug, Default, Clone)]
pub struct ApiServerState {
    pub todo: &'static str,
}
`,
      [`crates/${name}/src/bootstrap/routers.rs`]: `//! Route crate mounting plan.

pub const ROUTER_TODO: &str =
    "TODO(appstore-implementation): mount app-api, backend-api, and open-api route crates";
`,
      [`crates/${name}/src/server/mod.rs`]: `//! HTTP listener boundary.

pub fn planned_listener_name() -> &'static str {
    "TODO(appstore-implementation): start sdkwork-appstore-api-server listener"
}
`,
      [`crates/${name}/src/preflight/mod.rs`]: `//! Startup preflight placeholders.

pub fn preflight_todo() -> &'static str {
    "TODO(appstore-implementation): validate config, database, migrations, and dependency surfaces"
}
`,
      [`crates/${name}/src/health.rs`]: `//! Health check placeholder.

pub fn health_status() -> &'static str {
    "planned"
}
`,
    },
  };
}

function serviceHostCrate() {
  const name = "sdkwork-appstore-service-host";
  return {
    name,
    files: {
      [`crates/${name}/Cargo.toml`]: cargoToml(name),
      [`crates/${name}/README.md`]: crateReadme(
        name,
        "In-process service container skeleton for local/private/native App Store runtimes.",
        [
          "wire all service crates behind one typed container",
          "inject SQLx repositories and SDK dependency adapters",
          "run service-host preflight without mounting HTTP routes",
        ],
      ),
      [`crates/${name}/src/lib.rs`]: `//! SDKWork App Store service host.

pub mod bootstrap;
pub mod host;
pub mod preflight;

pub fn service_host_name() -> &'static str {
    "sdkwork-appstore-service-host"
}
`,
      [`crates/${name}/src/bootstrap/mod.rs`]: `//! Service host bootstrap modules.

pub mod config;
pub mod repositories;
pub mod services;
`,
      [`crates/${name}/src/bootstrap/config.rs`]: `//! Service host configuration placeholder.

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ServiceHostConfig {
    pub database_url: String,
}

impl Default for ServiceHostConfig {
    fn default() -> Self {
        Self {
            database_url: "sqlite://sdkwork-appstore.db".to_string(),
        }
    }
}
`,
      [`crates/${name}/src/bootstrap/repositories.rs`]: `//! Repository wiring placeholder.

pub fn repository_wiring_todo() -> &'static str {
    "TODO(appstore-implementation): construct appstore SQLx repositories"
}
`,
      [`crates/${name}/src/bootstrap/services.rs`]: `//! Service wiring placeholder.

pub fn service_wiring_todo() -> &'static str {
    "TODO(appstore-implementation): construct publisher/listing/release/catalog/library/moderation/compliance services"
}
`,
      [`crates/${name}/src/host/mod.rs`]: `//! Service host modules.

pub mod service_container;
`,
      [`crates/${name}/src/host/service_container.rs`]: `//! Service container placeholder.

#[derive(Debug, Default, Clone)]
pub struct AppstoreServiceContainer {
    pub todo: &'static str,
}

impl AppstoreServiceContainer {
    pub fn planned() -> Self {
        Self {
            todo: "TODO(appstore-implementation): wire real service instances and ports",
        }
    }
}
`,
      [`crates/${name}/src/preflight/mod.rs`]: `//! Service host preflight placeholder.

pub fn preflight_todo() -> &'static str {
    "TODO(appstore-implementation): validate database and dependency adapter configuration"
}
`,
    },
  };
}

function repositoryCrate() {
  const name = "sdkwork-appstore-repository-sqlx";
  const tableConstants = tableNames
    .map((table) => `    "${table}",`)
    .join("\n");
  return {
    name,
    files: {
      [`crates/${name}/Cargo.toml`]: cargoToml(name),
      [`crates/${name}/README.md`]: crateReadme(
        name,
        "SQLx repository implementation skeleton for appstore_* tables.",
        [
          "implement service-defined repository ports without HTTP concerns",
          "map schema-registry tables to row types and query modules",
          "enforce tenant and organization predicates on repository methods",
        ],
      ),
      [`crates/${name}/src/lib.rs`]: `//! App Store SQLx repository skeleton.

pub mod db;
pub mod error;
pub mod mapper;
pub mod repository;
`,
      [`crates/${name}/src/error.rs`]: `//! Repository error placeholder.

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RepositoryError {
    pub message: &'static str,
}
`,
      [`crates/${name}/src/db/mod.rs`]: `//! Database schema modules.

pub mod rows;
pub mod schema;
`,
      [`crates/${name}/src/db/schema.rs`]: `//! appstore_* table registry for repository implementation.

pub const APPSTORE_TABLES: &[&str] = &[
${tableConstants}
];
`,
      [`crates/${name}/src/db/rows.rs`]: `//! Database row placeholders.

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AppstoreRowPlaceholder {
    pub table_name: &'static str,
}
`,
      [`crates/${name}/src/mapper/mod.rs`]: `//! Row to domain mapper placeholders.

pub fn mapper_todo() -> &'static str {
    "TODO(appstore-implementation): map SQLx rows to service domain models"
}
`,
      [`crates/${name}/src/repository/mod.rs`]: `//! Repository implementation modules.

pub mod queries;
`,
      [`crates/${name}/src/repository/queries.rs`]: `//! SQL query placeholders.

pub const QUERY_TODO: &str =
    "TODO(appstore-implementation): implement tenant-safe SQLx queries for appstore_* tables";
`,
    },
  };
}

function analyticsWorkerCrate() {
  const name = "sdkwork-appstore-analytics-worker";
  return {
    name,
    files: {
      [`crates/${name}/Cargo.toml`]: `${cargoToml(name)}
[[bin]]
name = "sdkwork-appstore-analytics-worker"
path = "src/main.rs"
`,
      [`crates/${name}/README.md`]: crateReadme(
        name,
        "Background worker skeleton for App Store metric and chart projections.",
        [
          "project install/listing metric snapshots from durable events",
          "generate catalog chart snapshots with retryable cursors",
          "coordinate with service/repository ports instead of direct policy bypasses",
        ],
      ),
      [`crates/${name}/src/lib.rs`]: `//! App Store analytics worker skeleton.

pub mod bootstrap;
pub mod jobs;
pub mod scheduler;
`,
      [`crates/${name}/src/main.rs`]: `fn main() {
    println!("{}", sdkwork_appstore_analytics_worker::jobs::worker_todo());
}
`,
      [`crates/${name}/src/bootstrap/mod.rs`]: `//! Worker bootstrap placeholder.

pub fn bootstrap_todo() -> &'static str {
    "TODO(appstore-implementation): construct worker repositories, service ports, and schedules"
}
`,
      [`crates/${name}/src/jobs/mod.rs`]: `//! Analytics job placeholders.

pub fn worker_todo() -> &'static str {
    "TODO(appstore-implementation): implement listing metrics and chart projection jobs"
}
`,
      [`crates/${name}/src/scheduler/mod.rs`]: `//! Worker scheduler placeholder.

pub fn scheduler_todo() -> &'static str {
    "TODO(appstore-implementation): implement durable schedule, cursor, retry, and lock handling"
}
`,
    },
  };
}

function cratesReadme(crateNames) {
  return `# Crates

Rust implementation crates for SDKWork App Store.

## Planned Layers

- \`sdkwork-appstore-api-server\` - HTTP process host.
- \`sdkwork-appstore-service-host\` - in-process service composition, no HTTP routes.
- \`sdkwork-appstore-*-service\` - business use-case services.
- \`sdkwork-appstore-repository-sqlx\` - SQLx repository implementations for \`appstore_*\` tables.
- \`sdkwork-router-*-{app-api,backend-api,open-api}\` - HTTP route adapters and route manifest sources.
- \`sdkwork-appstore-analytics-worker\` - metric and chart projection jobs.

## Crate Inventory

${crateNames.map((name) => `- \`${name}\``).join("\n")}

All crates are skeletons for handoff. Business behavior remains marked with
\`TODO(appstore-implementation)\`.
`;
}

function implementationTodo(crateNames) {
  return `# App Store Implementation TODO

This file is the handoff index for the next implementation agents. The current
round intentionally lands module boundaries, compileable Rust crate skeletons,
route descriptors, and service/repository/worker placeholders only.

## Global Rules

- TODO(appstore-implementation): implement from authored OpenAPI, schema registry, and SDKWork specs.
- TODO(appstore-implementation): keep business rules in service crates, not route handlers.
- TODO(appstore-implementation): keep SQL in \`sdkwork-appstore-repository-sqlx\`, not handlers/services.
- TODO(appstore-implementation): use generated/dependency SDKs for appbase, Drive, comments, and commerce.
- TODO(appstore-implementation): preserve \`appstore_*\` table ownership and \`appstore.*\` operation IDs.

## Crate Work Queue

${crateNames.map((name) => `- TODO(appstore-implementation): complete \`${name}\`.`).join("\n")}

## First Implementation Pass

1. TODO(appstore-implementation): define shared request context and authorization policy model.
2. TODO(appstore-implementation): implement publisher/listing/release happy-path service tests.
3. TODO(appstore-implementation): implement SQLx repositories for publisher, app, listing, release, and submission aggregates.
4. TODO(appstore-implementation): mount app-api route crates in \`sdkwork-appstore-api-server\`.
5. TODO(appstore-implementation): add contract tests that compare route manifests with authored OpenAPI.
`;
}

async function main() {
  const crates = [
    apiServerCrate(),
    serviceHostCrate(),
    repositoryCrate(),
    analyticsWorkerCrate(),
    ...serviceCapabilities.map(serviceCrate),
    ...routeCrates.map(routeCrate),
  ];

  const crateNames = crates.map((crate) => crate.name);
  const workspaceMembers = crates
    .map((crate) => `  "crates/${crate.name}"`)
    .join(",\n");

  await write(
    "Cargo.toml",
    `[workspace]
members = [
${workspaceMembers}
]
resolver = "2"
`,
  );
  await write("crates/README.md", cratesReadme(crateNames));
  await write("crates/IMPLEMENTATION_TODO.md", implementationTodo(crateNames));

  for (const crate of crates) {
    for (const [relativePath, content] of Object.entries(crate.files)) {
      await write(relativePath, content);
    }
  }
}

await main();
