export const runtime = 'edge';
export async function POST(request: Request) {
    const body = await request.json()
    if(process.env.PRODUCTION_MODE==='1' && request.headers.get('origin')!=='https://starrysky-console.pages.dev'){
        return new Response('error', {
            status: 500
        })
    }
    const result = await fetch(body.serverUrl+"/setQuery",
        {
            method: 'post',headers: {
                'Content-Type': 'application/json',
                'X-Starrtsky-WebpassKey':request.headers.get('x-starrtsky-webpasskey')||''
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