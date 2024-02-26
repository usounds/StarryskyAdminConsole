export const runtime = 'edge';
export async function POST(request: Request) {
    const { serverUrl, authkey,key } = (await request.json()) as { serverUrl: string, authkey: string,key:string }

    const requestJson = {
        key : key,
        authkey : authkey,
    }

    const result = await fetch(serverUrl+"/getQuery",
        {
            method: 'post',headers: {
                'Content-Type': 'application/json' // JSON形式のデータのヘッダー
            },
            body: JSON.stringify(requestJson)
        }
        );
        console.log()

    return new Response(await result.body, {
        status: result.status,
        headers: {
            'content-type': 'application/json'
        }
    })
}