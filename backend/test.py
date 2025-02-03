import secrets

# Generate a 24-byte random secret key (which is sufficient for most use cases)
secret_key = secrets.token_urlsafe(24)

print(secret_key)
