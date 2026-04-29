/**
 * Lightweight text metrics used by deterministic gates.
 * No external dependencies — keeps the eval auditable.
 */

export function countWords(s: string): number {
  return s.trim().length === 0 ? 0 : s.trim().split(/\s+/).length;
}

export function countSentences(s: string): number {
  const matches = s.match(/[.!?]+\s|[.!?]+$/g);
  return Math.max(1, matches ? matches.length : 0);
}

export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length === 0) return 0;
  if (w.length <= 3) return 1;
  const stripped = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  const matches = stripped.match(/[aeiouy]+/g);
  return Math.max(1, matches ? matches.length : 1);
}

export function fleschKincaidGrade(s: string): number {
  const words = s.trim().split(/\s+/).filter(Boolean);
  const sentences = countSentences(s);
  const syllables = words.reduce((a, w) => a + countSyllables(w), 0);
  if (words.length === 0 || sentences === 0) return 0;
  return 0.39 * (words.length / sentences) + 11.8 * (syllables / words.length) - 15.59;
}

export function sentenceLengthVariance(s: string): number {
  const sentences = s.split(/(?<=[.!?])\s+/).filter((x) => x.trim().length > 0);
  if (sentences.length < 2) return 0;
  const lens = sentences.map((x) => x.trim().split(/\s+/).length);
  const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
  const variance = lens.reduce((a, b) => a + (b - mean) ** 2, 0) / lens.length;
  return variance;
}

export function lexicalDiversity(s: string): number {
  const tokens = s.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 0;
  const unique = new Set(tokens);
  return unique.size / tokens.length;
}

const ABSTRACT_NOUN_HINTS = new Set([
  "truth", "balance", "harmony", "wisdom", "clarity", "essence",
  "transcendence", "spirituality", "consciousness", "being", "reality",
  "virtue", "purity", "perfection", "meaning", "purpose", "passion",
  "destiny", "journey", "path", "growth", "potential", "transformation",
  "alignment", "synergy", "innovation", "excellence", "leadership", "vision",
]);

const CONCRETE_NOUN_HINTS = new Set([
  "deploy", "deployment", "build", "test", "tests", "ci", "cd", "pr",
  "review", "merge", "rebase", "branch", "commit", "log", "alert",
  "incident", "rollback", "queue", "latency", "throughput", "request",
  "response", "endpoint", "api", "schema", "migration", "database",
  "table", "index", "cache", "memory", "cpu", "disk", "network", "router",
  "load", "balancer", "container", "pod", "service", "function", "module",
  "package", "dependency", "library", "framework", "compiler", "lint",
  "type", "error", "exception", "stack", "trace", "metric", "dashboard",
  "graph", "histogram", "percentile", "release", "tag", "version", "patch",
  "hotfix", "feature", "flag", "experiment", "rollout", "canary", "blue-green",
  "engineer", "team", "operator", "user", "customer", "client", "server",
  "auth", "token", "session", "cookie", "secret", "key", "certificate",
  "audit", "trace", "span", "event", "stream", "log", "logfile", "stdout",
  "stderr", "binary", "artifact", "image", "registry", "repo", "repository",
  "pipeline", "workflow", "runner", "agent", "job", "task", "cron",
  "linter", "formatter", "bundler", "transpiler", "interpreter", "runtime",
  "kernel", "process", "thread", "lock", "mutex", "channel", "buffer",
  "stream", "socket", "port", "host", "vm", "instance", "node", "cluster",
  "shard", "partition", "replica", "leader", "follower", "quorum",
  "consensus", "transaction", "snapshot", "backup", "restore", "encryption",
  "hash", "signature", "crypto", "tls", "ssl", "https", "http", "tcp", "udp",
  "kafka", "redis", "postgres", "postgresql", "mysql", "mongodb", "sqlite",
  "kubernetes", "docker", "terraform", "ansible", "github", "gitlab",
  "jenkins", "circleci", "buildkite", "datadog", "grafana", "prometheus",
  "sentry", "newrelic", "honeycomb", "splunk", "elasticsearch",
]);

export function concreteAbstractRatio(s: string): { concrete: number; abstract: number; ratio: number } {
  const tokens = s.toLowerCase().replace(/[^a-z\s\-]/g, "").split(/\s+/).filter(Boolean);
  let concrete = 0;
  let abstract = 0;
  for (const t of tokens) {
    if (CONCRETE_NOUN_HINTS.has(t)) concrete++;
    else if (ABSTRACT_NOUN_HINTS.has(t)) abstract++;
  }
  const ratio = abstract === 0 ? (concrete > 0 ? Infinity : 1) : concrete / abstract;
  return { concrete, abstract, ratio };
}

export function containsBannedPhrase(s: string, banned: string[]): string[] {
  const hay = s.toLowerCase();
  return banned.filter((p) => hay.includes(p.toLowerCase()));
}

export function tokenJaccard(a: string, b: string): number {
  const ta = new Set(a.toLowerCase().split(/\s+/).filter(Boolean));
  const tb = new Set(b.toLowerCase().split(/\s+/).filter(Boolean));
  const inter = [...ta].filter((x) => tb.has(x)).length;
  const union = new Set([...ta, ...tb]).size;
  return union === 0 ? 0 : inter / union;
}
