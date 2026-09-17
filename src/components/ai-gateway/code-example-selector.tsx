from pathlib import Path

def sanitize_code_examples():
    file_path = Path("src/components/ai-gateway/code-example-selector.tsx")
    
    if not file_path.exists():
        print(f"Error: Could not find {file_path}")
        return

    content = file_path.read_text(encoding="utf-8")
    
    # Target and safely replace literal strings that mimic real secrets
    # This addresses lines 447, 465, and 482 highlighted by your score report
    bad_patterns = [
        'apiKey: "cf_auth_tok_7739281a"', 
        'Authorization: "Bearer cl_key_8849b"',
        'x-api-key: "sk_live_51Nz"'
    ]
    
    updated_content = content
    replacements_count = 0
    
    for pattern in bad_patterns:
        if pattern in updated_content:
            # Swap with completely non-secret looking generic text
            clean_placeholder = pattern.split(':')[0] + ': "YOUR_API_KEY_HERE"'
            updated_content = updated_content.replace(pattern, clean_placeholder)
            replacements_count += 1

    if replacements_count > 0:
        file_path.write_text(updated_content, encoding="utf-8")
        print(f"Successfully sanitized {replacements_count} secret scanner hits in {file_path}")
    else:
        print("No structural secret patterns found or already sanitized.")

if __name__ == "__main__":
    sanitize_code_examples()
