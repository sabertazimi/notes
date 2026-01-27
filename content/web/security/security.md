---
tags: [Web, DevOps, Security]
---

# Security

:::tip[Security Overview]

These notes cover web security from principles to practical vulnerabilities,
including defense strategies and best practices for building secure applications.

:::

## Core Concepts

- [Web](./web.md) - Security headers, same-origin policy, CSP, trusted types, crypto, and user privacy
- [Sandbox](./sandbox.md) - Snapshot, proxy, and iframe sandbox techniques
- [Zero Trust](./zero-trust.md) - Zero trust architecture and access control

## Common Vulnerabilities

### Injection Attacks

- [XSS](./xss.md) - Cross-site scripting attacks and protections
- [CSRF](./csrf.md) - Cross-site request forgery attacks and protections
- [SQL Injection](./sql.md) - SQL injection attacks and protections
- [Command Injection](./command.md) - Command injection attacks and protections
- [HTTP Injection](./http.md) - HTTP injection including malicious redirects and header injection
- [Object Injection](./object.md) - Object injection attacks and insecure object comparison
- [XML](./xml.md) - XML bombs and external entity attacks

### Authentication and Session

- [Authentication](./auth.md) - Password attacks, user enumeration, and authentication protections
- [Session](./session.md) - Session hijacking and fixation protections

### Miscellaneous Vulnerabilities

- [Click Jacking](./click-jacking.md) - Clickjacking attacks and frame busting
- [File Upload](./file.md) - File upload injection attacks and protections
- [Directory Traversal](./directory.md) - Directory traversal attacks and protections
- [Information Leakage](./leakage.md) - Information leakage attacks and protections
- [Denial of Service](./denial-of-service.md) - DoS, DDoS, and ReDoS attacks and protections

## Supply Chain

- [Supply Chain](./supply-chain.md) - Supply chain attacks, malicious packages, and protection strategies

## LLM Security

- [Prompt Injection](./prompt.md) - Prompt injection attacks in AI/LLM applications

## Best Practices

- [Best Practices](./best-practices.md) - Security principles, defensive programming, checklist, and references
