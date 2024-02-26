export async function POST(request: Request) {
    const body = await request.json()
    const result = await fetch(body.serverUrl+"/setQuery",
        {
            method: 'post',headers: {
                'Content-Type': 'application/json' // JSON形式のデータのヘッダー
            },
            body: JSON.stringify(body)
        }
        );
    return new Response(await result.body, {
        status: result.status,
        headers: {
            'content-type': 'application/json'
        }
    })
}