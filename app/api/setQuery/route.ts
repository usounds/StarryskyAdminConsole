export const runtime = 'edge';
import { getRequestContext } from '@cloudflare/next-on-pages'

export async function POST(request: Request) {
    if((process.env.NODE_ENV==='production' || process.env.PRODUCTION_MODE === '1' ) && (request.headers.get('origin')==='https://starrysky-console.pages.dev' && request.headers.get('origin')==='https://preview.starrysky-console.pages.dev/') ){
        return new Response('This Starrysky Admin Console is production mode. setQuery API only accept via https://starrysky-console.pages.dev', {
            status: 500
        })
    }
    const body = await request.json()
    const {serverUrl,key,recordName,query,inputRegex,invertRegex,refresh,lang,labelDisable,replyDisable,imageOnly,includeAltText,initPost,pinnedPost,feedAvatar,feedName,feedDescription,privateFeed,limitCount} = (body) as { 
        serverUrl:string,
        key:string,
        recordName:string,
        query:string,
        inputRegex:string,
        invertRegex:string,
        refresh:string,
        lang:string,
        labelDisable:string,
        replyDisable:string,
        imageOnly:string,
        includeAltText:string,
        initPost:string,
        pinnedPost:string,
        lastExecTime:string,
        limitCount:string,
        feedName:string,
        feedDescription:string,
        feedAvatar:string,
        privateFeed:string}

    //外部アクセスを弾く
    if(process.env.NODE_ENV==='production' && request.headers.get('origin')!=='https://starrysky-console.pages.dev'){
        return new Response('error', {
            status: 500
        })
    }

    //Query Engineに書き込み
    const result = await fetch(serverUrl+"/setQuery",
        {
            method: 'post',headers: {
                'Content-Type': 'application/json',
                'X-Starrtsky-WebpassKey':request.headers.get('x-starrtsky-webpasskey')||''
            },
            body: JSON.stringify(body)
        }
        );

    if(result.status !==200){
        return new Response(await result.body, {
            status: result.status,
            headers: {
                'content-type': 'application/json'
            }
        })

    }

    //D1に書き込み
    const { env } = getRequestContext()
    const myDb = env.DB
    let results  = await myDb.prepare('delete from conditions where serverUrl = ? and key = ?').bind(serverUrl,key).run()
    const collectionName = 'conditions'
    const convertedEntity = {
        serverUrl:serverUrl,
        key:key,
        recordName:recordName,
        query:query,
        inputRegex:inputRegex,
        invertRegex:invertRegex,
        refresh:refresh,
        lang:lang,
        labelDisable:labelDisable,
        replyDisable:replyDisable,
        imageOnly:imageOnly,
        initPost:initPost,
        pinnedPost:pinnedPost,
        feedName:feedName,
        feedDescription:feedDescription,
        limitCount:limitCount,
        privateFeed:privateFeed,
        includeAltText:includeAltText,
        feedAvatar:''
    }

    const keys = Object.keys(convertedEntity)
    const valuesPlaceholders = keys.map((_, index) => `?${index + 1}`).join(', ')
    const values = Object.values(convertedEntity)
    const stmt = myDb.prepare(`INSERT INTO ${collectionName} (${keys.map(key => `"${key}"`).join(', ')}) VALUES (${valuesPlaceholders});`).bind(...values)

    try{
        await stmt.run()
        return new Response(JSON.stringify({ result:'OK' }) , {
            status: 200,
            headers: {
                'content-type': 'application/json'
            }
        })

    }catch(e){
        console.log(e)

        return new Response(JSON.stringify({ result:'NG',message:'D1への書き込みに失敗しました' }) , {
            status: 500,
            headers: {
                'content-type': 'application/json'
            }
        })

    }
}