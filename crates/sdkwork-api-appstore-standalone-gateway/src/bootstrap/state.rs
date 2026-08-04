//! Application state shared by mounted route crates.
//!
//! The `AppState` composition type lives in `sdkwork-appstore-routes-common`;
//! route crates consume it through their own `State<AppState>` extractors.

#[allow(unused_imports)]
pub use sdkwork_appstore_routes_common::AppState;
