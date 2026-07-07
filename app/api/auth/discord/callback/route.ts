import { NextRequest, NextResponse } from "next/server";

/**
 * Discord OAuth — Step 2: Exchange the authorization code for an access
 * token, then fetch the user's Discord profile.
 *
 * SCAFFOLD ONLY. This route needs the same env vars as
 * app/api/auth/discord/route.ts, plus DISCORD_CLIENT_SECRET.
 *
 * The access token is exchanged and used entirely server-side in this
 * function — it is never sent to the browser. In a real deployment you'd
 * typically store the resulting session (e.g. in a signed cookie or your
 * database) rather than returning the raw token as JSON.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      {
        error:
          "Discord OAuth is not configured yet. Set DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, and DISCORD_REDIRECT_URI in your environment.",
      },
      { status: 501 }
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code from Discord." },
      { status: 400 }
    );
  }

  try {
    const tokenResponse = await fetch(
      "https://discord.com/api/oauth2/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text();
      return NextResponse.json(
        { error: "Failed to exchange code for token.", details: errorBody },
        { status: 502 }
      );
    }

    const tokenData = await tokenResponse.json();

    const profileResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!profileResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Discord profile." },
        { status: 502 }
      );
    }

    const profile = await profileResponse.json();

    // In a real app: set a session cookie or store the token in your
    // database here, then redirect back to the dashboard.
    return NextResponse.redirect(
      new URL(`/?discord_connected=true&username=${profile.username}`, request.url)
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected error during Discord OAuth callback." },
      { status: 500 }
    );
  }
}
