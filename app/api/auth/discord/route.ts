import { NextResponse } from "next/server";

/**
 * Discord OAuth — Step 1: Redirect to Discord's consent screen.
 *
 * This route is a SCAFFOLD. It will not function until you:
 *   1. Create an application at https://discord.com/developers/applications
 *   2. Add a redirect URI there matching DISCORD_REDIRECT_URI below
 *   3. Set these environment variables (e.g. in .env.local):
 *        DISCORD_CLIENT_ID=your_client_id
 *        DISCORD_CLIENT_SECRET=your_client_secret
 *        DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/discord/callback
 *
 * Nothing in this file exposes the client secret to the browser — the
 * secret is only ever used server-side, in the callback route.
 */
export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      {
        error:
          "Discord OAuth is not configured yet. Set DISCORD_CLIENT_ID and DISCORD_REDIRECT_URI in your environment to enable this route.",
      },
      { status: 501 }
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify guilds.join",
  });

  return NextResponse.redirect(
    `https://discord.com/api/oauth2/authorize?${params.toString()}`
  );
}

