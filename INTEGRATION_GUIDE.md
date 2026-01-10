# CTF Challenge Integration Guide

## Overview

Two challenges have been updated to use **real vulnerabilities** instead of frontend simulations:

- **Challenge 4**: Library Database (SQL Injection)
- **Challenge 6**: Domain Name Secrets (Real DNS TXT Record)

## Setup Instructions

### Challenge 4: Library Database (SQL Injection)

#### What's Implemented:
- Frontend books browser that calls two API endpoints:
  - `/api/books/getAll` - Safe endpoint that lists books
  - `/api/books/get?id=<book_id>` - **VULNERABLE endpoint** (placeholder)

#### Integration Steps:

1. **Replace the vulnerable API endpoint** at `src/app/api/books/get/route.ts`
2. Your vulnerable API should:
   - Accept an `id` parameter from the URL query string
   - Be vulnerable to SQL injection on this parameter
   - Return responses in this format:
     ```json
     // Success
     { "success": true, "book": {...book_data...} }
     
     // Error  
     { "error": "error message" }
     ```

3. **Update the flag** in `src/lib/challenges-server.ts`:
   ```typescript
   flag: 'FLAG{YOUR_ACTUAL_FLAG}', // Line 63
   ```

#### Example Integration:
```typescript
// Replace the entire /api/books/get/route.ts with:
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  // Call your vulnerable API
  const response = await fetch(`http://your-vulnerable-api.com/books?id=${id}`);
  const data = await response.json();
  
  return NextResponse.json(data);
}
```

### Challenge 6: Domain Name Secrets (Real DNS)

#### What's Implemented:
- Frontend component that displays DNS lookup instructions
- Provides multiple methods to query TXT records
- Links to online DNS tools as alternatives

#### Setup Steps:

1. **Create a TXT record** in your domain's DNS:
   ```
   Domain: your-domain.com
   Type: TXT  
   Value: "FLAG{YOUR_DNS_FLAG}"
   ```

2. **Update domain configuration** in two files:

   **File 1:** `src/lib/challenges.ts` (line ~89)
   ```typescript
   extraData: {
     domain: 'your-actual-domain.com' // Replace with your domain
   },
   ```

   **File 2:** `src/lib/challenges-server.ts` (line ~95 and ~99)
   ```typescript
   extraData: {
     domain: 'your-actual-domain.com' // Replace with your domain
   },
   // ...
   flag: 'FLAG{YOUR_DNS_FLAG}', // Replace with your actual flag
   ```

#### DNS Record Example:
```bash
# Test your DNS record:
nslookup -type=TXT your-domain.com
dig TXT your-domain.com

# Should return something like:
your-domain.com. TXT "FLAG{DNS_SECRET_FLAG}"
```

## Testing

### SQL Injection Challenge:
1. Visit `/challenges/4` 
2. Browse books (calls safe `/getAll` endpoint)
3. Click on a book (calls vulnerable `/get?id=X` endpoint)
4. Try SQL injection payloads in the browser URL: `/challenges/4` then click book, then modify URL to `/api/books/get?id=1' OR '1'='1`

### DNS Challenge:
1. Visit `/challenges/6`
2. Copy the provided commands
3. Run DNS lookup from command line
4. Find the flag in TXT records

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── books/
│   │       ├── getAll/route.ts    # Safe endpoint
│   │       └── get/route.ts       # VULNERABLE - replace this
│   └── challenges/[id]/page.tsx   # Updated to use new components
├── components/ctf/
│   ├── BooksApi.tsx              # Books browser component  
│   └── RealDns.tsx               # DNS lookup instructions
└── lib/
    ├── challenges.ts             # Client-side metadata (no flags)
    └── challenges-server.ts      # Server-side with flags
```

## Notes

- All TypeScript errors shown are just configuration issues and won't affect functionality
- The frontend components are ready to use your backend APIs
- Make sure to update flags in `challenges-server.ts` to match your actual flags
- DNS changes may take time to propagate (up to 24-48 hours)

## Security Notes

- The SQL injection endpoint should be **actually vulnerable** - not simulated
- Make sure your vulnerable API is isolated and doesn't affect production systems
- Consider running the vulnerable API in a containerized/sandboxed environment