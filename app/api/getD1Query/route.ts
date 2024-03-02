import { getRequestContext } from '@cloudflare/next-on-pages'
export const runtime = 'edge'

export async function POST(request: Request) {
  console.log('getD1Query')
  /*
  if(process.env.NODE_ENV==='production' && request.headers.get('origin')!=='https://starrysky-console.pages.dev'){
    return new Response('error', {
        status: 500
    })
  }
  */

  const { serverUrl,key } = (await request.json()) as { serverUrl: string, key:string }
  console.log(serverUrl + ':' + key)
	const { env } = getRequestContext()
	const myDb = env.DB
　let results 
  if(key !== undefined && key!=='') results = await myDb.prepare('select * from conditions where serverUrl = ? and key = ?').bind(serverUrl,key).all()
  else results = await myDb.prepare('select * from conditions where serverUrl = ? ').bind(serverUrl).all()

  let resultObject

  if(results.results.length>0){
    resultObject = {
      result :'OK',
      resultRecord:results.results
    }
  }else{
    resultObject = {
      result : 'NOT_FOUND'
    }
  }

  return new Response(JSON.stringify(resultObject)  , {
    status: 200,
    headers: {
        'content-type': 'application/json'
    }
})
}