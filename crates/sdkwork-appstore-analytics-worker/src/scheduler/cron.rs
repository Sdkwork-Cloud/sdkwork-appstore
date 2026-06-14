use std::time::Duration;

pub struct Scheduler {
    interval: Duration,
}

impl Scheduler {
    pub fn new(interval: Duration) -> Self {
        Self { interval }
    }

    pub fn interval(&self) -> Duration {
        self.interval
    }
}
