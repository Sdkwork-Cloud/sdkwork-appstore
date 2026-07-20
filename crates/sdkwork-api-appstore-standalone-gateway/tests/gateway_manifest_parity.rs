//! Ensures gateway `.route()` registrations match the combined HTTP route manifest.

use std::collections::BTreeSet;
use std::fs;
use std::path::PathBuf;

fn gateway_routes_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("src/routes")
}

fn manifest_path() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("src/http_route_manifest.rs")
}

fn extract_manifest_routes(source: &str) -> BTreeSet<(String, String)> {
    let mut routes = BTreeSet::new();
    let mut method = String::new();
    for line in source.lines() {
        if line.contains("HttpMethod::Get") {
            method = "GET".to_string();
        } else if line.contains("HttpMethod::Post") {
            method = "POST".to_string();
        } else if line.contains("HttpMethod::Put") {
            method = "PUT".to_string();
        } else if line.contains("HttpMethod::Patch") {
            method = "PATCH".to_string();
        } else if line.contains("HttpMethod::Delete") {
            method = "DELETE".to_string();
        } else if let Some(path) = line
            .split('"')
            .nth(1)
            .filter(|value| value.starts_with('/'))
        {
            if !method.is_empty() {
                routes.insert((method.clone(), path.to_string()));
                method.clear();
            }
        }
    }
    routes
}

fn extract_gateway_routes(source: &str) -> BTreeSet<(String, String)> {
    let mut routes = BTreeSet::new();

    for segment in source.split(".route(").skip(1) {
        let Some(path) = segment
            .split('"')
            .nth(1)
            .filter(|value| value.starts_with('/'))
        else {
            continue;
        };

        for (needle, method) in [
            ("get(", "GET"),
            ("post(", "POST"),
            ("put(", "PUT"),
            ("patch(", "PATCH"),
            ("delete(", "DELETE"),
        ] {
            if segment.contains(needle) {
                routes.insert((method.to_string(), path.to_string()));
            }
        }
    }

    routes
}

#[test]
fn gateway_routes_match_http_route_manifest() {
    let manifest_source = fs::read_to_string(manifest_path()).expect("read http_route_manifest.rs");
    let expected = extract_manifest_routes(&manifest_source);

    let mut actual = BTreeSet::new();
    for entry in fs::read_dir(gateway_routes_dir()).expect("read routes dir") {
        let entry = entry.expect("route dir entry");
        let path = entry.path();
        if path.extension().and_then(|ext| ext.to_str()) != Some("rs") {
            continue;
        }
        let file_name = path
            .file_name()
            .and_then(|name| name.to_str())
            .unwrap_or("");
        if matches!(file_name, "support.rs" | "mod.rs") {
            continue;
        }
        let source = fs::read_to_string(&path).expect("read route module");
        actual.extend(extract_gateway_routes(&source));
    }

    let missing: Vec<_> = expected.difference(&actual).cloned().collect();
    let extra: Vec<_> = actual.difference(&expected).cloned().collect();

    assert!(
        missing.is_empty() && extra.is_empty(),
        "gateway/manifest drift\nmissing: {missing:?}\nextra: {extra:?}"
    );
    assert_eq!(
        expected.len(),
        actual.len(),
        "gateway route count mismatch (expected {})",
        expected.len()
    );
}
