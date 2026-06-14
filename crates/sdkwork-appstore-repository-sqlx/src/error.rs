//! Repository errors.

use std::fmt::{Display, Formatter};

pub type RepositoryResult<T> = Result<T, RepositoryError>;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RepositoryError {
    MissingTable(&'static str),
    NotFound(String),
    Conflict(String),
    Database(String),
    Mapping(String),
}

impl Display for RepositoryError {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::MissingTable(table) => write!(formatter, "Missing table: {}", table),
            Self::NotFound(message) => write!(formatter, "Not found: {}", message),
            Self::Conflict(message) => write!(formatter, "Conflict: {}", message),
            Self::Database(message) => write!(formatter, "Database error: {}", message),
            Self::Mapping(message) => write!(formatter, "Mapping error: {}", message),
        }
    }
}

impl std::error::Error for RepositoryError {}
