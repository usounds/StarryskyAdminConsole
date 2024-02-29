import { headers } from 'next/headers'

export const runtime = 'edge';
export async function POST(request: Request) {
    const { serverUrl,key } = (await request.json()) as { serverUrl: string, key:string }
    if(process.env.PRODUCTION_MODE==='1' && request.headers.get('origin')!=='https://starrysky-console.pages.dev'){
        return new Response('error', {
            status: 500
        })
    }

    const requestJson = {
        key : key
    }

    const result = await fetch(serverUrl+"/getQuery",
        {
            method: 'post',headers: {
                'Content-Type': 'application/json',
                'X-Starrtsky-WebpassKey':headers().get('x-starrtsky-webpasskey')||''
            },
            body: JSON.stringify(requestJson)
        }
        );

    return new Response(await result.body, {
        status: result.status,
        headers: {
            'content-type': 'application/json'
        }
    })
}