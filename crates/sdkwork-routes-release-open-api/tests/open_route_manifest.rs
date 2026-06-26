use sdkwork_routes_release_open_api::{open_route_manifest, route_definitions};
use sdkwork_web_core::RouteAuth;

#[test]
fn release_open_route_manifest_matches_route_definitions() {
    let manifest = open_route_manifest();
    assert_eq!(route_definitions().len(), 3);
    for entry in route_definitions() {
        let matched = manifest
            .match_route(entry.method, entry.path)
            .unwrap_or_else(|| {
                panic!(
                    "missing http route manifest for {} {}",
                    entry.method, entry.path
                )
            });
        let expected_auth = if entry.operation_id == "appstore.releases.public.retrieve" {
            RouteAuth::Public
        } else {
            RouteAuth::ApiKey
        };
        assert_eq!(matched.auth, expected_auth);
        assert_eq!(matched.operation_id, entry.operation_id);
    }
}
