# GitHub Issue Template Repository - Security Edition

This repository contains configuration templates for GitHub issue management and secure Bedrock integration.

## ⚠️ Security Notice

**This repository is now PRIVATE and contains secure credential management practices.**

- ✅ AWS credentials are environment-variable based
- ✅ `.gitignore` prevents accidental credential commits
- ✅ Secret scanning is enabled
- ✅ No credentials in git history

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AnticipatedD/github-ISSUE_TEMPLATE.git
   cd github-ISSUE_TEMPLATE
   ```

2. **Set up credentials:**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your AWS credentials
   # WARNING: .env is gitignored and must never be committed
   nano .env
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Files

- **`.env.example`** - Template for environment variables (committed, no real values)
- **`.env`** - Local credentials file (GITIGNORED, never committed)
- **`.gitignore`** - Prevents credential leaks
- **`bedrock_client.py`** - Secure Bedrock client initialization
- **`SECURITY.md`** - Detailed security guidelines

## Configuration

### Environment Variables

```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
```

### Using the Bedrock Client

```python
from bedrock_client import get_bedrock_client

# Initialize client (uses environment variables)
client = get_bedrock_client()

# Or use IAM role (for AWS services)
from bedrock_client import get_bedrock_client_with_iam_role
client = get_bedrock_client_with_iam_role()
```

## Security

- **Repository Status**: Private ✓
- **Secret Scanning**: Enabled ✓
- **Credential Management**: Environment variables ✓
- **Review**: See `SECURITY.md` for detailed guidelines

### Credential Rotation

Rotate AWS credentials every 90 days or immediately if exposed:

1. Generate new credentials in AWS IAM Console
2. Update `.env` file locally
3. Delete old credentials
4. Verify all services work

## Support

For security concerns or credential exposure incidents:
1. Immediately rotate AWS credentials
2. Check `SECURITY.md` for incident response procedures
3. Review AWS CloudTrail logs for unauthorized access

## License

Creative Commons Attribution 4.0 International (CC-BY-4.0)

---

**Last Updated:** 2026-05-30  
**Status**: Secured ✓
