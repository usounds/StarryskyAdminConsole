import { headers } from 'next/headers'

export const runtime = 'edge';
export async function POST(request: Request) {
    console.log('getQuery')
    const { serverUrl,key } = (await request.json()) as { serverUrl: string, key:string }
    console.log(serverUrl + ':' + key)

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


    const aaa = await result.json()

    return new Response(JSON.stringify(aaa), {
        status: result.status,
        headers: {
            'content-type': 'application/json'
        }
    })
}