import { NextResponse } from 'next/server';

export async function GET() {
  const robots = `User-agent: *
Allow: /public/
Disallow: /admin/
Disallow: /n0t_s0_s3cr3t/
Disallow: /thisisnotimportant/
Sitemap: https://encode-ctf.local/sitemap.xml

# If you're reading this, you're probably a CTF player
# Good luck exploring the forbidden paths!`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
