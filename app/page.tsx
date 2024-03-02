"use client"
export const runtime = 'edge';
import { useCallback, useRef, useState } from 'react';
import { TextareaAutosize } from '@mui/base';
import { BskyAgent } from '@atproto/api'
import { AtpAgent, BlobRef } from '@atproto/api'

const agent = new BskyAgent({ service: 'https://bsky.social' })

export default function Home() {
  const [serverUrl, setServerUrl] = useState("https://");
  const [webPassKey, setWebPassKey] = useState("");
  const [editFeed, setEditFeed] = useState("starrysky01");

  const [loginMessage, setLoginMessage] = useState("");
  const [putQueryMessage, setPutQueryMessage] = useState("");
  const [publishMessage, setPublishMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isServerEditable, setIsServerEditable] = useState(true);
  const [isCanPublish, setIsCanPublish] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isNewMode, setIsNewMode] = useState(false);
  //const [isMemoryMode, setIsMemoryMode] = useState(false);
  const [isRestoreFromD1, setIsRestoreFromD1] = useState(false);
  const [isSpinner, setIsSpinner] = useState<boolean>(true)

  const [key, setKey] = useState("");
  const [recordName, setRecordName] = useState("");
  const [query, setQuery] = useState("");
  const [inputRegex, setInputRegex] = useState("");
  const [invertRegex, setInvertRegex] = useState("");
  const [refresh, setRefresh] = useState("");
  const [lang, setLang] = useState("");
  const [labelDisable, setLabelDisable] = useState("true");
  const [replyDisable, setReplyDisable] = useState("false");
  const [imageOnly, setImageOnly] = useState("false");
  const [includeAltText, setIncludeAltText] = useState("true");
  const [initPost, setInitPost] = useState("");
  const [pinnedPost, setPinnedPost] = useState("");
  const [lastExecTime, setLastExecTime] = useState("");
  const [limitCount, setLimitCount] = useState("");
  const [privateFeed, setPrivateFeed] = useState("");
  const [feedAvatar, setFeedAvatar] = useState<File>()
  const [feedName, setFeedName] = useState("");
  const [feedDescription, setFeedDescription] = useState("");
  const [blueskyHandle, setBlueskyHandle] = useState("");
  const [blueskyAppPassword, setBlueskyAppPassword] = useState("");
  const [recordCount, setRecordCount] = useState("");

  const [feedAvatarImg, setFeedAvatarImg] = useState('')

  interface Conditions {
    serverUrl: string;
    key: string;
    recordName: string;
    query: string;
    inputRegex: string;
    invertRegex: string;
    refresh: number;
    lang: string;
    labelDisable: string;
    replyDisable: string;
    imageOnly: string;
    initPost: number;
    pinnedPost: string;
    feedName: string;
    feedDescription: string;
    limitCount: number;
    privateFeed: string;
    includeAltText:string;
  }

  const onDemoMode = async (): Promise<void> => {
    setLoginMessage('')
    setIsDemoMode(true)
    setIsEditing(true)
  }

  const onLoad = async (): Promise<void> => {
    let paramServerURL = serverUrl

    if (serverUrl === 'https://') {
      setLoginMessage('Server URLを入力してください。')
      return

    }

    if (serverUrl.slice(-1) === '/') {
      paramServerURL = serverUrl.slice(0, -1)
      setServerUrl(serverUrl.slice(0, -1))

    }

    if (webPassKey === '') {
      setLoginMessage('Web Pass Keywordを入力してください。')
      return

    }

    const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-starrtsky-webpasskey':webPassKey },
      body: JSON.stringify({ serverUrl: paramServerURL, key: editFeed })
    };

    try {
      const res = await fetch('/api/getQuery', requestOptions);
      const resJson= await res.json()
      console.log(resJson);
      if (res.status == 200) {
        const {isMemoryMode,recordName,query,inputRegex,invertRegex,refresh,lang,labelDisable,replyDisable,imageOnly,includeAltText,initPost,
          pinnedPost,lastExecTime,limitCount,feedName,feedDescription,privateFeed,recordCount,result} = (resJson) as { 
          isMemoryMode:boolean,
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
          privateFeed:string,
          recordCount:string,
          result:string
        }
        setLoginMessage('')

        //Query Engineにデータがある
        if (result === 'OK') {
          setKey(editFeed)
          setRecordName(recordName)
          setQuery(query)
          setInputRegex(inputRegex)
          setInvertRegex(invertRegex)
          setRefresh(refresh)
          setLang(lang)
          setLabelDisable(labelDisable)
          setReplyDisable(replyDisable)
          setImageOnly(imageOnly)
          setIncludeAltText(includeAltText)
          setInitPost(initPost)
          setPinnedPost(pinnedPost)
          setLastExecTime(lastExecTime)
          setLimitCount(limitCount)
          setFeedName(feedName)
          setFeedDescription(feedDescription)
          setPrivateFeed(privateFeed)
          setRecordCount(recordCount)
          setIsEditing(true)
          setIsServerEditable(false)
          setIsDemoMode(false)
          setIsNewMode(false)
          setIsRestoreFromD1(false)

        // Query Engineにデータがない
        } else if (result === 'NOT_FOUND') {
          console.log('Query Engineデータなし')
          //D1から取得する
          const resD1 = await fetch('/api/getD1Query', requestOptions)
          if(resD1.status==200){
            const resD1Body = await resD1.json()
            const {result,resultRecord} = (resD1Body) as { result:string, resultRecord:Conditions[]}

            if(result==='OK'){
              console.log('D1から復元')
              const record = resultRecord[0]
              console.log(record)
              setKey(record.key)
              setRecordName(record.recordName)
              setQuery(record.query)
              setInputRegex(record.inputRegex)
              setInvertRegex(record.invertRegex)
              setRefresh(record.refresh.toString())
              setLang(record.lang)
              setLabelDisable(record.labelDisable)
              setReplyDisable(record.replyDisable)
              setImageOnly(record.imageOnly)
              setIncludeAltText(record.includeAltText)
              setInitPost(record.initPost.toString())
              setPinnedPost(record.pinnedPost)
              setLimitCount(record.limitCount.toString())
              setFeedName(record.feedName)
              setFeedDescription(record.feedDescription)
              setPrivateFeed(record.privateFeed)
              setLimitCount(record.limitCount.toString())
              setIsRestoreFromD1(true)
            }else{
              setKey(editFeed)
              setRecordName(editFeed)
              setQuery('')
              setInputRegex('')
              setInvertRegex('')
              setRefresh('0')
              setLang('')
              setLabelDisable('true')
              setReplyDisable('false')
              setImageOnly('false')
              setIncludeAltText('true')
              setInitPost('100')
              setPinnedPost('')
              setLastExecTime('')
              setLimitCount('500')
              setFeedName('')
              setFeedDescription('')
              setPrivateFeed('')
              setLimitCount('2000')
              setIsRestoreFromD1(false)

            }

          }
          setIsEditing(true)
          setIsServerEditable(false)
          setIsDemoMode(false)
          setIsNewMode(true)
        }
      } else {
        setLoginMessage('読み込みに失敗しました。:' + await res.status)
      }

    } catch (err) {
      setLoginMessage('読み込みに失敗しました' + err)
    }
  }

  const onSave = async (): Promise<void> => {

    if(recordName===''){
      setPutQueryMessage('Record Nameは必須です。Record Nameを入力してください。')
      return
    }

    if(query===''){
      setPutQueryMessage('Bluesky Queryは必須です。Bluesky Queryを入力してください。')
      return
    }

    if(inputRegex===''){
      setPutQueryMessage('Input Regexは必須です。Input Regexを入力してください。')
      return
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
      'x-starrtsky-webpasskey':webPassKey 
     },
      body: JSON.stringify(
        {
          key: key,
          recordName: recordName,
          query: query,
          inputRegex: inputRegex,
          invertRegex: invertRegex,
          refresh: refresh,
          lang: lang,
          labelDisable: labelDisable,
          replyDisable: replyDisable,
          imageOnly: imageOnly,
          includeAltText: includeAltText,
          initPost: initPost,
          pinnedPost: pinnedPost,
          serverUrl: serverUrl,
          feedName: feedName,
          feedDescription: feedDescription,
          privateFeed: privateFeed,
          limitCount: limitCount
        }
      )
    };

    try {
      const res = await fetch('/api/setQuery', requestOptions);
      const returnObject =  await res.json()
      const {result,message} = (returnObject) as { result:string,message:string }
      if (res.status == 200) {
        //const ret = await res.json();
        console.log(result+ ' : ' + message)
        if (result === 'OK') {
          alert('更新処理が成功しました')
          setPutQueryMessage('')
          setIsCanPublish(true)
          setIsNewMode(false)
          setIsRestoreFromD1(false)
        } else {
          setPutQueryMessage('更新処理が失敗しました:' + message)

        }
      } else {
        setPutQueryMessage('更新処理が失敗しました:' + message)

      }
    } catch (err) {

    }

  }

  const onPublishFeed = async (): Promise<void> => {

    let avatarRef: BlobRef | undefined
    let encoding: string = ''

    if(blueskyHandle===''){
      setPublishMessage('Bluesky Handleは必須です')
      return

    }

    if(blueskyAppPassword===''){
      setPublishMessage('Bluesky App Passwordは必須です')
      return

    }
    
    if (feedAvatar?.name.endsWith('png')) {
      encoding = 'image/png'
    } else if (feedAvatar?.name.endsWith('jpg') || feedAvatar?.name.endsWith('jpeg')) {
      encoding = 'image/jpeg'
    } else  {
      setPublishMessage('ファイル形式はPNGかJPGです')
      return
    }

    try {
      if (!agent.hasSession) await agent.login({ identifier: blueskyHandle, password: blueskyAppPassword })
    } catch (e) {
      setPublishMessage('エラーが発生しました：'+e)
      return
    }

    if (feedAvatar) {
      const fileUint = new Uint8Array(await feedAvatar.arrayBuffer())

      const blobRes = await agent.uploadBlob(fileUint, {
        encoding,
      })
      avatarRef = blobRes.data.blob
    }

    let hostname = serverUrl.replace("https://", "").replace("/", "")

    try {
      await agent.api.com.atproto.repo.putRecord({
        repo: agent.session?.did ?? '',
        collection: 'app.bsky.feed.generator',
        rkey: recordName,
        record: {
          did: "did:web:" + hostname,
          displayName: feedName,
          description: feedDescription,
          avatar: avatarRef,
          createdAt: new Date().toISOString(),
        },
      })
    } catch (e) {
      setPublishMessage('エラーが発生しました：'+e)

    }

    alert('更新完了')

    setPublishMessage('')

  }


  const onDeleteFeed = async (): Promise<void> => {
    try {
      if (!agent.hasSession) await agent.login({ identifier: blueskyHandle, password: blueskyAppPassword })
    } catch (e) {
      alert(e)
      return
    }

    const did = agent.session?.did ?? ''

    let record = {
      repo: did,
      collection: 'app.bsky.feed.generator',
      rkey: recordName,
    }

    try {
      await agent.api.com.atproto.repo.deleteRecord(
        record
      )
      alert('削除結果はBlueskyで確認してください')
    } catch (e) {
      alert(e)
      return
    }


  }

  const changeFeedAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const imgObject = e.target.files[0];
    setFeedAvatar(imgObject)
    setFeedAvatarImg(window.URL.createObjectURL(imgObject))

  };

  return (
    <main >
      <div className="bg-white py-4 sm:py-4 lg:py-4">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-4 lg:text-3xl">Starrysky Admin Console</h2>

          {!isEditing &&
            <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg mb-3">Starryskyのご利用は、事前に<a href="https://blog.usounds.work/posts/starry-sky-01/" className="text-black">Query Engineの構築</a>が必要です。</p>
          }

          <div className="mx-auto max-w-lg rounded-lg border">
            <div className="flex flex-col gap-4 p-4 md:p-8">
              {!isEditing &&
                <div>
                  <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Server URL</label>
                  <input autoComplete='username' value={serverUrl} onChange={(event) => setServerUrl(event.target.value)} placeholder="YOURSERVER.com" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                </div>
              }
              {!isEditing &&
                <div>
                  <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Web Pass Keyword</label>
                  <input autoComplete='username' type="password" value={webPassKey} onChange={(event) => setWebPassKey(event.target.value)} placeholder="EDIT_WEB_PASSKEYの設定値" name="password" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                </div>
              }
              <div>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Edit Custom Feed</label>
                <select value={editFeed} onChange={(event) => { setEditFeed(event.target.value); setIsEditing(false); }} className="py-3 px-4 pe-9 border-2 block w-full bg-gray-50 ring-indigo-300 text-gray-800 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none ">
                  <option>starrysky01</option>
                  <option>starrysky02</option>
                </select>
                <p className="mt-3 text-xs text-gray-600 dark:text-gray-600">編集するカスタムフィードを選択します。</p>
              </div>
              <button onClick={onLoad} className="block rounded-lg bg-blue-800 px-8 py-3 text-center text-sm text-white outline-none ring-blue-300 transition duration-100 hover:bg-blue-700 focus-visible:ring active:bg-blue-600 md:text-base">読み込み</button>
              {!isEditing && <button onClick={onDemoMode} className="block rounded-lg bg-gray-800 px-8 py-3 text-center text-sm text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base">デモモード</button>}
              {loginMessage && <p className="text-red-500">{loginMessage}</p>}
            </div>

          </div>
        </div>
      </div>

            {isEditing &&
              <div className="bg-white py-6 sm:py-8 lg:py-12">
                <div className="mx-auto max-w-screen-2xl px-4 md:px-8">

                  
                  {isNewMode &&
                    <div className="mx-auto gap-4 mb-5">
                      <div className="mx-auto max-w-screen-2xl px-4">
                        <div className="flex flex-col items-center rounded-lg bg-gray-100 p-2 sm:p-4">
                          <p className="text-center text-gray-500">Query Engineには{key}は登録されていません。新規登録を行います。</p>
                        </div>
                      </div>
                    </div>
                  }

                  
            {isRestoreFromD1 &&
              <div className="mx-auto gap-4 mb-5">
                <div className="mx-auto max-w-screen-2xl px-4">
                  <div className="flex flex-col items-center rounded-lg bg-gray-100 p-2 sm:p-4">
                    <p className="text-center text-gray-500">Query Engineには検索条件は保存されていませんでしたが、Admin Consoleに検索結果が残っていましたので復元しました。復元した内容はQuery Engineには登録されていませんので、必ずQuery Engineへの更新を行なってください。</p>
                  </div>
                </div>
              </div>
            }

            <div className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2 mb-5">
              <div className='mb-2'>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">フィード名</label>
                <input value={feedName} onChange={(event) => setFeedName(event.target.value)} placeholder="超テスト" name="recordname" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">Blueskyに表示されるフィード名になります。変更した場合は「公開」を行なわないとBlueskyのアプリに反映されません。</p>
              </div>

              <div>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">フィードの説明</label>
                <TextareaAutosize value={feedDescription} onChange={(event) => setFeedDescription(event.target.value)} className="border bg-gray-50 text-gray-800 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none 0" placeholder="テスト用のフィードです"></TextareaAutosize>
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">BlueskyのAboutに表示されます。変更した場合は「公開」を行なわないとBlueskyのアプリに反映されません。</p>
              </div>
            </div>

            <div className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2 mb-5">
              <div className='mb-2'>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">処理時間</label>
                <input disabled value={lastExecTime} className="w-full rounded border bg-gray-200 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">入力項目ではありません。最後の取り込みジョブの処理時間です</p>
              </div>

              <div className='mb-2'>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">現在の投稿数合計</label>
                <input disabled value={recordCount} className="w-full rounded border bg-gray-200 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">入力項目ではありません。Query Engineに登録されている投稿の件数です</p>
              </div>

            </div>

            <div className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2 mb-5">
              <div className='mb-2'>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Record Name</label>
                <input value={recordName} onChange={(event) => setRecordName(event.target.value)} placeholder="starrysky01" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">通常は変更不要です。SkyFeedやContrailsから乗り換える場合は、以前使っていたRecord Nameを入力してください。</p>
              </div>

              <div>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">言語フィルタ</label>
                <input value={lang} onChange={(event) => setLang(event.target.value)} placeholder="ja" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">日本語に絞り込む場合は「ja」と入力します。複数指定する場合は[,]で区切ります。絞り込みを行わない場合は入力不要です。</p>
              </div>
            </div>

            <div className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2 mb-5">
              <div>
                <div className='text-gray-800'>Refresh</div>

                <input value={refresh} onChange={(event) => setRefresh(event.target.value)} placeholder="100" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">その件数登録済みの投稿が削除されます。「Invert Regexを修正したので、30件ぐらい前のあの投稿を消したい、」の時は50ぐらいを指定します。</p>
              </div>

              <div>
                <div className='text-gray-800'>初期取り込み件数</div>
                <input value={initPost} onChange={(event) => setInitPost(event.target.value)} placeholder="100" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">最初の処理において取り込む件数を指定します。</p>
              </div>
            </div>

            <div className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2 mb-5">
              <div>
                <div><label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">成人向けコンテンツ<br /></label></div>
                <div className="flex gap-x-6">
                  <div className="flex">
                    <input value="false" checked={labelDisable === "false"} onChange={(event) => setLabelDisable(event.target.value)} type="radio" name="label-radio-group" className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-radio-group-1" />
                    <label className="text-sm text-gray-500 ms-2 dark:text-gray-800">検索する</label>
                  </div>

                  <div className="flex">
                    <input value="true" checked={labelDisable === "true"} onChange={(event) => setLabelDisable(event.target.value)} type="radio" name="label-radio-group" className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-radio-group-2" />
                    <label className="text-sm text-gray-500 ms-2 dark:text-gray-800">検索しない</label>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">センシティブ設定された投稿を検索対象にします。</p>
              </div>

              <div>
                <div>
                  <div><label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">リプライ<br /></label></div>
                  <div className="flex gap-x-6">
                    <div className="flex">
                      <input value="false" checked={replyDisable === "false"} onChange={(event) => setReplyDisable(event.target.value)} type="radio" name="reply-radio-group" className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-radio-group-1" />
                      <label className="text-sm text-gray-500 ms-2 dark:text-gray-800">検索する</label>
                    </div>

                    <div className="flex">
                      <input value="true" checked={replyDisable === "true"} onChange={(event) => setReplyDisable(event.target.value)} type="radio" name="reply-radio-group" className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-radio-group-2" />
                      <label className="text-sm text-gray-500 ms-2 dark:text-gray-800">検索しない</label>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">リプライを検索対象にします。</p>
                </div>
              </div>
            </div>


            <div className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2 mb-5">
              <div>
                <div><label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">画像のみ投稿<br /></label></div>
                <div className="flex gap-x-6">
                  <div className="flex">
                    <input value="false" checked={imageOnly === "false"} onChange={(event) => setImageOnly(event.target.value)} type="radio" name="imags-radio-group" className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-radio-group-1" />
                    <label className="text-sm text-gray-500 ms-2 dark:text-gray-800">全て検索</label>
                  </div>

                  <div className="flex">
                    <input value="true" checked={imageOnly === "true"} onChange={(event) => setImageOnly(event.target.value)} type="radio" name="imags-radio-group" className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-radio-group-2" />
                    <label className="text-sm text-gray-500 ms-2 dark:text-gray-800">画像付き投稿のみ検索</label>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">画像が添付された投稿のみを検索対象とします。</p>
              </div>

              <div>
                <div>
                  <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">画像のALT文字の検索</label>
                </div>
                <div className="flex gap-x-6">
                  <div className="flex">
                    <input value="true" checked={includeAltText === "true"} onChange={(event) => setIncludeAltText(event.target.value)} type="radio" name="alt-radio-group" className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-radio-group-1" />
                    <label className="text-sm text-gray-500 ms-2 dark:text-gray-800">検索する</label>
                  </div>

                  <div className="flex">
                    <input value="false" checked={includeAltText === "false"} onChange={(event) => setIncludeAltText(event.target.value)} type="radio" name="alt-radio-group" className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-radio-group-2" />
                    <label className="text-sm text-gray-500 ms-2 dark:text-gray-800">検索しない</label>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">画像のALTに設定された文字を検索します。</p>
              </div>
            </div>


            <div className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2 mb-5">
              <div>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Bluesky Query</label>
                <TextareaAutosize value={query} onChange={(event) => setQuery(event.target.value)} className="border bg-gray-50 text-gray-800 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none " placeholder="(ガスリー|オコン)"></TextareaAutosize>
                <p className="mt-3 text-xs text-gray-600 dark:text-gray-600">検索キーワードを指定します。Inpu Regexから面倒な記号を取り除いたものとします。</p>

              </div>

              <div>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Input Regex</label>
                <TextareaAutosize value={inputRegex} onChange={(event) => setInputRegex(event.target.value)} className="border bg-gray-50 text-gray-800 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none " placeholder="((?:^|[^ァ-ヶｦ-ﾟ・])ガスリー[^ァ-ヴ・]|(?:^|[^ァ-ヶｦ-ﾟ・])オコン[^ァ-ヴ・])"></TextareaAutosize>
                <p className="mt-3 text-xs text-gray-600 dark:text-gray-600">絞り込みを行う正規表現を入力。複数指定する場合は全体をカッコ()でくくります。</p>

              </div>
            </div>


            <div className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Invert Regex</label>
                <TextareaAutosize value={invertRegex} onChange={(event) => setInvertRegex(event.target.value)} className="border bg-gray-50 text-gray-800 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none 0" placeholder="(メンテ|コンティニュ)"></TextareaAutosize>
                <p className="mt-3 text-xs text-gray-600 dark:text-gray-600">除外する正規表現を入力。複数指定する場合は全体をカッコ()でくくります。</p>

              </div>

              <div>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">処理ボタン</label>
                {!isDemoMode && <button onClick={onSave} className="block rounded-lg bg-blue-800 px-8 py-3 text-center text-sm text-white outline-none ring-blue-300 transition duration-100 hover:bg-blue-700 focus-visible:ring active:bg-blue-600 md:text-base">Query Engine更新</button>}
                {putQueryMessage && <p className="text-red-500">{putQueryMessage}</p>}
                <p className="mt-3 text-xs text-gray-600 dark:text-gray-600">入力した内容をQuery Engineに書き込みます。</p>
              </div>
            </div>

            {isCanPublish &&
              <div className="bg-white py-4 sm:py-4 lg:py-4">
                <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                  <div className="mx-auto max-w-lg rounded-lg border">
                    <div className="flex flex-col gap-4 p-4 md:p-4">
                      <p className="text-xs text-gray-400 dark:text-gray-600">作成した後にBlueskyのアプリからカスタムフィードを参照できるようにするには「公開」が必要です。一同公開すれば、説明文やアイコンを変更したい場合を除き、再度公開する必要はありません。</p>
                      <div>
                        <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Bluesky Handle</label>
                        <input value={blueskyHandle} onChange={(event) => setBlueskyHandle(event.target.value)} placeholder="abcd.bsky.socials" name="bskyuername" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                      </div>
                      <div>
                        <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Bluesky App Password</label>
                        <input value={blueskyAppPassword} type="password" onChange={(event) => setBlueskyAppPassword(event.target.value)} placeholder="zxcv-asdf-qwer" name="bskyapppassword" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                      </div>
                      <div>
                        <input type="file" accept=".png, .jpg, .jpeg" className="mb-2 w-[300px] inline-block text-sm text-gray-800 sm:text-base" onChange={changeFeedAvatar} />
                        <p className="text-xs text-gray-400 dark:text-gray-600">フィードのアイコンがデフォルトのままでよい場合は、画像は不要です。</p>
                      </div>

                      <button onClick={onPublishFeed} className="block rounded-lg bg-blue-800 px-8 py-3 text-center text-sm text-white outline-none ring-blue-300 transition duration-100 hover:bg-blue-700 focus-visible:ring active:bg-blue-600 md:text-base">公開</button>
                      {publishMessage && <p className="text-red-500">{publishMessage}</p>}
                      <p className="text-xs text-gray-400 dark:text-gray-600">「公開」したカスタムフィードを削除します。プロフィールから非表示になります。Query Engineのサーバーは消えませんので、ご自身で削除ください。</p>
                      <button onClick={onDeleteFeed} className="block rounded-lg bg-red-800 px-8 py-3 text-center text-sm text-white outline-none ring-red-300 transition duration-100 hover:bg-red-700 focus-visible:ring active:bg-red-600 md:text-base">公開の取り下げ</button>
                    </div>

                  </div>
                </div>
              </div>
            }

          </div>

        </div>


      }

      <div className="bg-white pt-4 sm:pt-10 lg:pt-12">
        <footer className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="flex flex-col items-center justify-between gap-4 border-t border-b py-6 md:flex-row">
            <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:justify-start md:gap-6">
              <a href="https://blog.usounds.work/posts/starry-sky-01/" className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600">Query Engine Setup</a>
              <a href="https://www.buymeacoffee.com/usounds" className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600">By me a coffee</a>
            </nav>
            <div className="flex gap-4">

              <a href="https://github.com/usounds/StarryskyQueryEngine" target="_blank" className="text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600">
                <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>


              <a href="https://bsky.app/profile/usounds.work" target="_blank" className="text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600">
                <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 1452 1452" xmlns="http://www.w3.org/2000/svg"><path d="M725.669,684.169c85.954,-174.908 196.522,-329.297 331.704,-463.171c45.917,-43.253 98.131,-74.732 156.638,-94.443c80.779,-23.002 127.157,10.154 139.131,99.467c-2.122,144.025 -12.566,287.365 -31.327,430.015c-29.111,113.446 -96.987,180.762 -203.629,201.947c-36.024,5.837 -72.266,8.516 -108.726,8.038c49.745,11.389 95.815,32.154 138.21,62.292c77.217,64.765 90.425,142.799 39.62,234.097c-37.567,57.717 -83.945,104.938 -139.131,141.664c-82.806,48.116 -154.983,33.716 -216.529,-43.202c-28.935,-38.951 -52.278,-81.818 -70.026,-128.603c-12.177,-34.148 -24.156,-68.309 -35.935,-102.481c-11.779,34.172 -23.757,68.333 -35.934,102.481c-17.748,46.785 -41.091,89.652 -70.027,128.603c-61.545,76.918 -133.722,91.318 -216.529,43.202c-55.186,-36.726 -101.564,-83.947 -139.131,-141.664c-50.804,-91.298 -37.597,-169.332 39.62,-234.097c42.396,-30.138 88.466,-50.903 138.21,-62.292c-36.46,0.478 -72.702,-2.201 -108.725,-8.038c-106.643,-21.185 -174.519,-88.501 -203.629,-201.947c-18.762,-142.65 -29.205,-285.99 -31.328,-430.015c11.975,-89.313 58.352,-122.469 139.132,-99.467c58.507,19.711 110.72,51.19 156.637,94.443c135.183,133.874 245.751,288.263 331.704,463.171Z" fill="currentColor" /></svg>
              </a>

            </div>
          </div>

          <div className="py-8 text-center text-sm text-gray-400">© 2024 - usounds. All rights reserved.</div>
        </footer>
      </div>

    </main>
  );
}
