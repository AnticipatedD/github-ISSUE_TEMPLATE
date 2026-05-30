# Security Guidelines

## Credential Management

### ⚠️ Critical Rules

1. **NEVER commit credentials to version control**
   - No hardcoded API keys, passwords, or tokens
   - No environment variables with real values in `.env` file
   - Always use `.env.example` as a template

2. **Use environment variables for local development**
   ```bash
   # Create a local .env file (gitignored)
   cp .env.example .env
   
   # Edit .env with your actual credentials
   # DO NOT commit this file
   ```

3. **Use IAM roles for AWS deployments**
   - Lambda functions
   - EC2 instances
   - ECS containers
   - Any AWS-hosted service

4. **For production, use AWS Secrets Manager**
   ```python
   import boto3
   secrets_client = boto3.client('secretsmanager')
   secret = secrets_client.get_secret_value(SecretId='my-secret')
   ```

## Credential Rotation

### When to rotate credentials:
- ✅ Immediately if exposed (even in private repos)
- ✅ Every 90 days (security best practice)
- ✅ After any infrastructure changes
- ✅ When team members leave

### How to rotate:
1. Create new AWS access keys in IAM console
2. Update all services with new credentials
3. Delete old access keys
4. Verify all services still work

## If Credentials Were Exposed

1. **Immediately rotate all AWS credentials**
   - Go to AWS IAM Console → Users → Your User → Security Credentials
   - Delete compromised access keys
   - Create new access keys

2. **Make repository private**
   - Settings → Danger Zone → Make Private

3. **Enable secret scanning**
   - Settings → Security & Analysis → Secret Scanning

4. **Check deployment logs**
   - Verify if compromised credentials were used
   - Look for unauthorized API calls in CloudTrail

5. **Review IAM permissions**
   - Limit access to only necessary services (Bedrock in this case)
   - Use resource-based policies
   - Enable CloudTrail logging

## File Safeguards

- `.env` — **GITIGNORED** (local credentials, never commit)
- `.env.example` — **COMMITTED** (template only, no real values)
- `.gitignore` — **COMMITTED** (prevents accidental commits)
- `bedrock_client.py` — **SAFE** (no credentials hardcoded)

## Repository Security Checklist

- [x] `.gitignore` properly configured
- [x] `.env` file is gitignored
- [x] `.env.example` contains no real credentials
- [x] All code uses environment variables for credentials
- [x] Repository is private
- [x] Secret scanning enabled
- [x] No credentials in commit history

## Best Practices

✅ **DO:**
- Use environment variables
- Use IAM roles on AWS services
- Rotate credentials regularly
- Store secrets in AWS Secrets Manager
- Monitor CloudTrail for unauthorized access
- Use least-privilege IAM policies

❌ **DON'T:**
- Hardcode credentials in code
- Commit `.env` files
- Use root AWS account credentials
- Share credentials via email or chat
- Leave default credentials unchanged
- Use credentials with excessive permissions

## References

- [AWS Security Best Practices](https://docs.aws.amazon.com/security/)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

**Last Updated:** 2026-05-30  
**Repository Privacy:** Private ✓  
**Secret Scanning:** Enabled ✓
