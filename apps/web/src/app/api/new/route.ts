const DEFAULT_API_URL = "http://127.0.0.1:4000";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  const targetApiUrl = apiUrl();

  try {
    const response = await fetch(`${targetApiUrl}/new`, {
      method: "POST",
      body: await request.formData(),
    });

    return new Response(await response.text(), {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    return Response.json(
      {
        message: "Unable to reach the API server",
        target: targetApiUrl,
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}

function apiUrl(): string {
  return (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL).replace(/\/$/, "");
}
