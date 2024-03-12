"use client"
export const runtime = 'edge';
import { useState, useEffect } from 'react'
import { TextareaAutosize } from '@mui/base'
import { BskyAgent, BlobRef } from '@atproto/api'
import { setCookie, getCookie, deleteCookie } from 'cookies-next'
import dayjs, { extend, locale } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ja';

const agent = new BskyAgent({ service: 'https://bsky.social' })

export default function Home() {
  const [serverUrl, setServerUrl] = useState("https://");
  const [webPassKey, setWebPassKey] = useState("");
  const [editFeed, setEditFeed] = useState("starrysky01");

  const [loginMessage, setLoginMessage] = useState("");
  const [putQueryMessage, setPutQueryMessage] = useState("");
  const [putQueryCompletMessage, setPutCompletQueryMessage] = useState("");
  const [publishMessage, setPublishMessage] = useState("");
  const [publishCompleteMessage, setPublishCompleteMessage] = useState("");
  const [blueskyLoginMessage, setBlueskyLoginMessage] = useState("");
  const [previewMessage, setPreviewMessage] = useState("");

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isServerEditable, setIsServerEditable] = useState<boolean>(true);
  const [isCanPublish, setIsCanPublish] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isNewMode, setIsNewMode] = useState<boolean>(false);
  const [isRestoreFromD1, setIsRestoreFromD1] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isBlueskyLogin, setIsBlueskyLogin] = useState<boolean>(false)
  //const [isSaveCookie, setIsSaveCookie] = useState<boolean>(false)

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
  const [queryEngineVersion, setQueryEngineVersion] = useState("");

  const [feedAvatarImg, setFeedAvatarImg] = useState('')

  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    (async function () {
      try {
        const serverUrl = getCookie('server-url')
        if (serverUrl) setServerUrl(serverUrl)
        const webPasskey = getCookie('web-passkey')
        if (webPasskey) setWebPassKey(webPasskey)

        const blueskyHandle = getCookie('bluesky-handle')
        if (blueskyHandle) setBlueskyHandle(blueskyHandle)
        const blueskyAppPassword = getCookie('bluesky-app-password')
        if (blueskyAppPassword) setBlueskyAppPassword(blueskyAppPassword)

        const blueskySession = getCookie('bluesky-session')

        if (blueskySession && !agent.hasSession) {
          console.log('resumeSessionよぶ')
          const blueskySessionJson = JSON.parse(blueskySession)
          const sessionObj = {
            refreshJwt: blueskySessionJson.refreshJwt,
            accessJwt: blueskySessionJson.accessJwt,
            handle: blueskySessionJson.handle,
            did: blueskySessionJson.did
          }
          await agent.resumeSession(sessionObj)
          setIsBlueskyLogin(true)
        }
        setIsLoading(false)

      } catch (e) {

        try {
          if (blueskyHandle && blueskyAppPassword) {
            await agent.login({ identifier: blueskyHandle, password: blueskyAppPassword })
            setCookie('bluesky-session', agent.session)
            setIsLoading(false)
          }
        } catch (e) {
          setBlueskyLoginMessage('エラーが発生しました：' + e)
          setIsLoading(false)
        }
      }
    })();
  }, [])

  type Post = {
    DisplayName: string;
    Avater: string;
    Handle: string;
    Text: string;
    Time: string;
    Image: imageObject[];
    IsReply: boolean;
  }

  type record = {
    indexedAt: string
    text?: string
    langs?: string[]
    reply: {}
    embed?: {
      images?: imageObject[]
    }
  }

  type imageObject = {
    alt: string
    aspectRatio: {
      height: number
      width: number
    }
    fullsize: string
    thumb: string
  }

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
    includeAltText: string;
  }

  const onDemoMode = async (): Promise<void> => {
    deleteMessage()
    setIsDemoMode(true)
    setIsEditing(true)
    setIsLoading(false)
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
    setRecordCount('')
    setFeedName('')
    setFeedDescription('')
    setPrivateFeed('')
    setLimitCount('2000')
    setIsRestoreFromD1(false)
  }

  const onLoad = async (): Promise<void> => {
    deleteMessage()
    setIsDemoMode(false)
    setIsEditing(false)
    let paramServerURL = serverUrl

    if (serverUrl === 'https://') {
      setLoginMessage('Server URLを入力してください。')
      setIsLoading(false)
      return

    }

    if (serverUrl.slice(-1) === '/') {
      paramServerURL = serverUrl.slice(0, -1)
      setServerUrl(serverUrl.slice(0, -1))

    }

    if (webPassKey === '') {
      setLoginMessage('Web Pass Keywordを入力してください。')
      setIsLoading(false)
      return

    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-starrtsky-webpasskey': webPassKey
      },
      body: JSON.stringify({ serverUrl: paramServerURL, key: editFeed })
    };

    try {
      const res = await fetch('/api/getQuery', requestOptions);
      const resJson = await res.json()
      if (res.status == 200) {

        setCookie('server-url', paramServerURL)
        setCookie('web-passkey', webPassKey)

        const { queryEngineVersion, recordName, query, inputRegex, invertRegex, refresh, lang, labelDisable, replyDisable, imageOnly, includeAltText, initPost,
          pinnedPost, lastExecTime, limitCount, feedName, feedDescription, privateFeed, recordCount, result } = (resJson) as {
            queryEngineVersion: string,
            recordName: string,
            query: string,
            inputRegex: string,
            invertRegex: string,
            refresh: string,
            lang: string,
            labelDisable: string,
            replyDisable: string,
            imageOnly: string,
            includeAltText: string,
            initPost: string,
            pinnedPost: string,
            lastExecTime: string,
            limitCount: string,
            feedName: string,
            feedDescription: string,
            privateFeed: string,
            recordCount: string,
            result: string
          }
        setLoginMessage('')


        //Query Engineにデータがある
        if (result === 'OK') {
          console.log('Query Engine Ver:' + queryEngineVersion)
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
          setIsCanPublish(true)
          setQueryEngineVersion(queryEngineVersion)

          // Query Engineにデータがない
        } else if (result === 'NOT_FOUND') {
          console.log('Query Engineデータなし')
          //D1から取得する

          const resD1 = await fetch('/api/getD1Query', requestOptions)
          if (resD1.status == 200) {
            const resD1Body = await resD1.json()
            const { result, resultRecord } = (resD1Body) as { result: string, resultRecord: Conditions[] }

            if (result === 'OK') {
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
              setRecordCount('')
              setIsRestoreFromD1(true)
              setQueryEngineVersion('')
            }else{
              console.log('D1にデータない')
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
              setLimitCount('2000')
              setRecordCount('')
              setFeedName('')
              setFeedDescription('')
              setPrivateFeed('')
              setIsRestoreFromD1(false)
              setQueryEngineVersion('')
            }

          } else {
            console.log('D1からのデータ取得失敗')
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
            setLimitCount('2000')
            setRecordCount('')
            setFeedName('')
            setFeedDescription('')
            setPrivateFeed('')
            setIsRestoreFromD1(false)
            setQueryEngineVersion('')
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

    setIsLoading(false)
  }

  const onBlueskyLogin = async (): Promise<void> => {
    deleteMessage()
    try {
      await agent.login({ identifier: blueskyHandle, password: blueskyAppPassword })
      setCookie('bluesky-session', agent.session)
      setCookie('bluesky-handle', blueskyHandle)
      setCookie('bluesky-app-password', blueskyAppPassword)
      setIsBlueskyLogin(true)
      setIsLoading(false)
    } catch (e) {
      setBlueskyLoginMessage('エラーが発生しました:' + e)
      setIsLoading(false)
    }

  }

  const onSave = async (): Promise<void> => {
    deleteMessage()

    if (recordName === '') {
      setPutQueryMessage('Record Nameは必須です。Record Nameを入力してください。')
      setIsLoading(false)
      return
    }

    if (query === '') {
      setPutQueryMessage('Bluesky Queryは必須です。Bluesky Queryを入力してください。')
      setIsLoading(false)
      return
    }

    if (inputRegex === '') {
      setPutQueryMessage('Input Regexは必須です。Input Regexを入力してください。')
      setIsLoading(false)
      return
    }

    if (key === '') {
      setPutQueryMessage('システムエラーが発生しました。Keyが設定されていません')
      setIsLoading(false)
      return
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-starrtsky-webpasskey': webPassKey
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
      const returnObject = await res.json()
      const { result, message } = (returnObject) as { result: string, message: string }
      if (res.status == 200) {
        //const ret = await res.json();
        console.log(result + ' : ' + message)
        if (result === 'OK') {
          setPutQueryMessage('')
          setPutCompletQueryMessage('更新処理が完了しました')
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
      setPutQueryMessage('更新処理が失敗しました:' + err)

    }


    setIsLoading(false)

  }

  const onPublishFeed = async (): Promise<void> => {
    deleteMessage()

    let avatarRef: BlobRef | undefined
    let encoding: string = ''

    if (feedAvatar?.name.endsWith('png')) {
      encoding = 'image/png'
    } else if (feedAvatar?.name.endsWith('jpg') || feedAvatar?.name.endsWith('jpeg')) {
      encoding = 'image/jpeg'
    } else if (feedAvatar !== undefined) {
      setPublishMessage('ファイル形式はPNGかJPGです')
      setIsLoading(false)
      return
    }

    try {
      blueskyLogin()
    } catch (e) {
      setPublishMessage('エラーが発生しました：' + e)
      setIsLoading(false)
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
      const postObject = {
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
      }

      const ret = await agent.api.com.atproto.repo.putRecord(postObject)
      if (ret.success) {
        setPublishCompleteMessage('更新処理が成功しました')

      } else {
        setPublishMessage('エラーが発生しました：' + await ret)

      }
    } catch (e) {
      setPublishMessage('エラーが発生しました：' + e)

    }

    setIsLoading(false)

  }


  const onLogout = async (): Promise<void> => {
    setIsBlueskyLogin(false)
    setIsCanPublish(false)
    setBlueskyHandle('')
    setBlueskyAppPassword('')
    deleteCookie('bluesky-session')
    deleteCookie('bluesky-handle')
    deleteCookie('bluesky-app-password')
    agent.session = {
      did: '',
      accessJwt: '',
      refreshJwt: '',
      handle: ''
    }

  }

  const onPreview = async (): Promise<void> => {
    deleteMessage()

    if (query === '') {
      setPreviewMessage('Bluesky Queryは必須です。Bluesky Queryを入力してください。')
      setIsLoading(false)
      return
    }

    if (inputRegex === '') {
      setPreviewMessage('Input Regexは必須です。Input Regexを入力してください。')
      setIsLoading(false)
      return
    }

    try {
      //Blueskyにログインする
      blueskyLogin()

      //取得済みポストを消す
      const startTime = Date.now(); // 開始時間
      let cursor = 0
      let apiCall = 0
      let resultPosts: Post[] = []

      do {

        //検索APIを実行する
        const params_search = {
          q: query,
          limit: 100,
          cursor: String(cursor)
        }
        const seachResults = await agent.api.app.bsky.feed.searchPosts(params_search)
        apiCall++

        cursor = Number(seachResults.data.cursor)

        locale('ja')
        extend(relativeTime)

        const inputRegexExp = new RegExp(inputRegex, 'i')  //抽出正規表現
        const invertRegexExp = new RegExp(invertRegex, 'i') //除外用正規表現
        const langObj = lang?.split(',')                     //言語フィルタ用配列

        for (let post of seachResults.data.posts) {
          const record = post.record as record
          let isReply = false

          let text = record.text || ''

          if (includeAltText === "true" && record.embed !== undefined && record.embed.images !== undefined) {
            for (let image of record.embed.images) {
              text = text + '\n' + image.alt
            }
          }

          //INPUTにマッチしないものは除外
          if (!text.match(inputRegexExp)) {
            continue
          }

          //Invertにマッチしたものは除外
          if (invertRegex !== '' && text.match(invertRegexExp)) {
            continue
          }



          //画像フィルタ
          const imageObject = post.embed?.images as imageObject[]
          if (imageOnly === 'imageOnly' && imageObject === undefined) {
            continue
          } else if (imageOnly === 'textOnly' && imageObject !== undefined && imageObject.length > 0) {
            continue
          }

          //言語フィルターが有効化されているか
          if (langObj !== undefined && langObj[0] !== "") {
            //投稿の言語が未設定の場合は除外
            if (record.langs === undefined) continue
            //言語が一致しない場合は除外
            if (!getIsDuplicate(record.langs, langObj)) continue
          }

          //ラベルが有効な場合は、ラベルが何かついていたら除外
          if (labelDisable === "true" && post.labels?.length !== 0) {
            continue
          }

          //リプライ無効の場合は、リプライを除外
          if (replyDisable === "true" && record.reply !== undefined) {
            continue
          }

          if (record.reply !== undefined) {
            isReply = true
          }

          const dateObj = Date.parse(post.indexedAt)

          resultPosts.push({
            DisplayName: post.author.displayName || '',
            Text: text,
            Time: dayjs(dateObj).fromNow(),
            Avater: post.author.avatar || '',
            Handle: post.author.handle,
            Image: imageObject,
            IsReply: isReply
          })
        }

        // 取得件数が100件を越す、APIからの取得が終わる、APIを100回呼び出した、処理を開始して10秒が経過した
        // いずれかを満たす場合は処理を終わらせる
      } while (resultPosts.length < 100 && cursor % 100 == 0 && apiCall < 100 && (Date.now() - startTime) < 10000)


      const endTime = Date.now(); // 終了時間
      setPreviewMessage(resultPosts.length + '件: ' + (endTime - startTime) + 'ms')
      setPosts(resultPosts)
      setIsLoading(false)
    } catch (e) {
      setPreviewMessage('エラーが発生しました:' + e)
      setIsLoading(false)
      return
    }
  }


  function getIsDuplicate(arr1: string[], arr2: string[]) {
    return [...arr1, ...arr2].filter(item => arr1.includes(item) && arr2.includes(item)).length > 0
  }

  function onPreviewReset() {
    setPreviewMessage('')
    setPosts(null)
  }

  function deleteMessage() {
    setIsLoading(true)
    setPublishCompleteMessage('')
    setPublishMessage('')
    setPutQueryMessage('')
    setLoginMessage('')
    setPutCompletQueryMessage('')
    setBlueskyLoginMessage('')
    setPosts(null)
    setPreviewMessage('')

  }

  const blueskyLogin = async (): Promise<void> => {
    //セッションがない
    if (!agent.hasSession) {
      setIsBlueskyLogin(false)
      const blueskySession = getCookie('bluesky-session')

      if (blueskySession) {
        console.log('resumeSessionよぶ')
        const blueskySessionJson = JSON.parse(blueskySession)
        const sessionObj = {
          refreshJwt: blueskySessionJson.refreshJwt,
          accessJwt: blueskySessionJson.accessJwt,
          handle: blueskySessionJson.handle,
          did: blueskySessionJson.did
        }
        try {
          await agent.resumeSession(sessionObj)
          setCookie('bluesky-session', agent.session)
          setIsBlueskyLogin(true)
          return
        } catch (e) {
          //何もしない
        }
      }

    }
  }

  const onDeleteFeed = async (): Promise<void> => {
    deleteMessage()

    try {
      if (!agent.hasSession) await agent.login({ identifier: blueskyHandle, password: blueskyAppPassword })
    } catch (e) {
      setPublishMessage('エラーが発生しました：' + e)
      setIsLoading(false)
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
      setPublishCompleteMessage('削除結果はBlueskyで確認してください')
    } catch (e) {
      setPublishMessage('エラーが発生しました：' + e)
    }

    setIsLoading(false)

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
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-4 lg:text-3xl">Starrysky Admin Console</h2>
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">

          {!isEditing &&
            <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg mb-3">Starryskyのご利用は、事前に<a href="https://blog.usounds.work/posts/starry-sky-01/" className="text-black">Query Engineの構築</a>が必要です。</p>
          }

          <div className="mx-auto max-w-lg rounded-lg border">
            <div className="flex flex-col gap-2 p-2 md:p-3">
              {!isEditing &&
                <div>

                  <div className="flex items-center mt-2 mb-2">
                    <label className="block ml-2 text-sm text-neutral-600">認証情報はクッキーに保存されます</label>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-800 dark:text-gray-800">Query Engine URL</label>
                    <input autoComplete='username' required value={serverUrl} onChange={(event) => setServerUrl(event.target.value)} placeholder="YOURSERVER.com" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-800 dark:text-gray-800">Web Pass Keyword</label>
                    <input autoComplete='username' required type="password" value={webPassKey} onChange={(event) => setWebPassKey(event.target.value)} placeholder="EDIT_WEB_PASSKEYの設定値" name="password" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                  </div>
                </div>
              }

              <div>
                <label className="block text-sm text-gray-800 dark:text-gray-800">Edit Custom Feed</label>
                <select value={editFeed} onChange={(event) => { setEditFeed(event.target.value); setIsEditing(false); }} className="py-3 px-4 pe-9 border-2 block w-full bg-gray-50 ring-indigo-300 text-gray-800 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none ">
                  <option>starrysky01</option>
                  <option>starrysky02</option>
                  <option>starrysky03</option>
                  <option>starrysky04</option>
                  <option>starrysky05</option>
                </select>
                <p className="mt-3 text-xs text-gray-600 dark:text-gray-600">編集するカスタムフィードを選択します。</p>
              </div>
              <button onClick={onLoad} disabled={isLoading} className="block rounded-lg bg-blue-800 px-8 py-3 text-center text-sm text-white outline-none ring-blue-300 transition duration-100 hover:bg-blue-700 focus-visible:ring active:bg-blue-600 disabled:bg-blue-100 md:text-base">読み込み</button>
              {!isEditing && <button disabled={isLoading} onClick={onDemoMode} className="block rounded-lg bg-gray-800 px-8 py-3 text-center text-sm text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 disabled:bg-gray-100 md:text-base">デモモード</button>}
              {loginMessage && <p className="text-red-500">{loginMessage}</p>}

              {!isBlueskyLogin &&
                <div>
                  <div>
                    <label className="block text-sm text-gray-800 dark:text-gray-800">Bluesky Handle(プレビュー/公開する際は必須)</label>
                    <input value={blueskyHandle} onChange={(event) => setBlueskyHandle(event.target.value)} placeholder="abcd.bsky.social" name="bskyuername" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-800 dark:text-gray-800">Bluesky App Password(プレビュー/公開する際は必須)</label>
                    <input value={blueskyAppPassword} type="password" onChange={(event) => setBlueskyAppPassword(event.target.value)} placeholder="zxcv-asdf-qwer" name="bskyapppassword" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                  </div>


                </div>
              }

              {!isBlueskyLogin &&
                <button onClick={onBlueskyLogin} disabled={isLoading} className="block rounded-lg bg-blue-800 px-8 py-3 text-center text-sm text-white outline-none ring-blue-300 transition duration-100 hover:bg-blue-700 focus-visible:ring active:bg-blue-600 disabled:bg-blue-100 md:text-base">Blueskyにログイン</button>
              }

              {blueskyLoginMessage && <p className="text-red-500">{blueskyLoginMessage}</p>}
            </div>

          </div>
        </div>
      </div>



      {isEditing &&
        <div className="bg-white py-4 sm:py-4 lg:py-4">
          <div className="mx-auto max-w-screen-2xl px-4 md:px-8">

            {isNewMode &&
              <div className="items-center rounded-lg  bg-gray-300 dark:bg-gray-300 mb-6 p-2 sm:p-4">
                <p className="text-center text-gray-500">Query Engineに{key}は登録されていません。新規登録を行います。</p>
              </div>
            }


            {isRestoreFromD1 &&
              <div className="items-center rounded-lg  bg-gray-300 dark:bg-gray-300 mb-6 p-2 sm:p-4">
                <p className="text-center text-gray-500">Query Engineには{key}は保存されていませんでしたが、Admin Consoleに{key}が残っていましたので復元しました。復元した内容はQuery Engineには登録されていませんので、必ずQuery Engineへの更新を行なってください。</p>
              </div>
            }

            {isDemoMode &&
              <div className="items-center rounded-lg  bg-gray-300 dark:bg-gray-300 mb-6 p-2 sm:p-4">
                <p className="text-center text-gray-500 ">デモモードで起動しています。表示している内容を保存したり、Blueskyにカスタムフィードとして公開することはできません。</p>
              </div>
            }

            {!isDemoMode &&
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
            }


            {!isDemoMode &&
              <div className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2 mb-5">
                <div className='mb-2'>
                  <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">処理時間</label>
                  <input disabled value={lastExecTime} className="w-full rounded border bg-gray-200 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                  <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">入力項目ではありません。最後の取り込みジョブの処理時間です</p>
                </div>

                <div className='mb-2'>
                  <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">現在の投稿数合計</label>
                  <input disabled value={recordCount} className="w-full rounded border bg-gray-200 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                  <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">入力項目ではありません。Query Engineに登録されている投稿の件数です。Query Engineを更新した直後は0件と表示されます。</p>
                </div>
              </div>
            }

            <div className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2 mb-5">
              {!isDemoMode &&
                <div className='mb-2'>
                  <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Record Name</label>
                  <input value={recordName} onChange={(event) => setRecordName(event.target.value)} placeholder="starrysky01" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                  <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">通常は変更不要です。SkyFeedやContrailsから乗り換える場合は、以前使っていたRecord Nameを入力してください。</p>
                </div>
              }

              <div>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">言語フィルタ</label>
                <input value={lang} onChange={(event) => setLang(event.target.value)} placeholder="ja" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">日本語に絞り込む場合は「ja」と入力します。複数指定する場合は[,]で区切ります。絞り込みを行わない場合は入力不要です。</p>
              </div>
            </div>

            {!isDemoMode &&
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
            }

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
                <div><label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">画像の投稿<br /></label></div>
                <div className="flex gap-x-6">
                  <div className="flex">
                    <input value="false" checked={imageOnly === "false"} onChange={(event) => setImageOnly(event.target.value)} type="radio" name="imags-radio-group" className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-radio-group-1" />
                    <label className="text-sm text-gray-500 ms-2 dark:text-gray-800">全て</label>
                  </div>

                  <div className="flex">
                    <input value="imageOnly" checked={imageOnly === "imageOnly"} onChange={(event) => setImageOnly(event.target.value)} type="radio" name="imags-radio-group" className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-radio-group-2" />
                    <label className="text-sm text-gray-500 ms-2 dark:text-gray-800">画像のみ</label>
                  </div>

                  <div className="flex">
                    <input value="textOnly" checked={imageOnly === "textOnly"} onChange={(event) => setImageOnly(event.target.value)} type="radio" name="imags-radio-group" className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-radio-group-2" />
                    <label className="text-sm text-gray-500 ms-2 dark:text-gray-800">文字のみ</label>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">「画像のみ」は画像が添付された投稿を検索します。「文字のみ」は画像が添付されていない投稿を検索します。「全て」以外は処理時間が長くなりますのでご注意ください。</p>
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
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">画像のALTに設定された文字を検索します。「検索する」はプレビューにALT文字が投稿本文にくっついて表示されます</p>
              </div>
            </div>


            <div className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2 mb-5">
              <div>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Bluesky Query</label>
                <TextareaAutosize value={query} onChange={(event) => setQuery(event.target.value)} className="border bg-gray-50 text-gray-800 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none " placeholder="(ガスリー|オコン)"></TextareaAutosize>
                <p className="mt-3 text-xs text-gray-600 dark:text-gray-600">検索キーワードを指定します。Input Regexから面倒な記号を取り除いたものとします。</p>

              </div>

              <div>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Input Regex</label>
                <TextareaAutosize value={inputRegex} onChange={(event) => setInputRegex(event.target.value)} className="border bg-gray-50 text-gray-800 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none " placeholder="((?:^|[^ァ-ヶｦ-ﾟ・])ガスリー[^ァ-ヴ・]|(?:^|[^ァ-ヶｦ-ﾟ・])オコン[^ァ-ヴ・])"></TextareaAutosize>
                <p className="mt-3 text-xs text-gray-600 dark:text-gray-600">絞り込みを行う正規表現を入力。複数指定する場合は全体をカッコ()でくくります。</p>

              </div>
            </div>


            <div className="mx-auto grid mb-4 max-w-screen-md gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Invert Regex</label>
                <TextareaAutosize value={invertRegex} onChange={(event) => setInvertRegex(event.target.value)} className="border bg-gray-50 text-gray-800 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none 0" placeholder="(メンテ|コンティニュ)"></TextareaAutosize>
                <p className="mt-3 text-xs text-gray-600 dark:text-gray-600">除外する正規表現を入力。複数指定する場合は全体をカッコ()でくくります。</p>

              </div>

              <div>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">処理ボタン</label>

                <button onClick={onPreview} disabled={isLoading} className="block mt-2 mb-2 rounded-lg w-full bg-blue-800 px-8 py-3 text-center text-sm text-white outline-none ring-blue-300 transition duration-100 hover:bg-blue-700 focus-visible:ring active:bg-blue-600 disabled:bg-blue-100 md:text-base">プレビュー</button>
                {previewMessage && <p className="text-red-500">{previewMessage}</p>}
                <p className="mt-3 text-xs text-gray-600 dark:text-gray-600">入力した検索条件の結果を表示します。100件を越すか10秒経過したら処理を止めます。処理時間はブラウザで処理しているため参考値で、Query Engineの実際の処理時間とは異なります。</p>
                {posts && <button onClick={onPreviewReset} disabled={isLoading} className="fixed z-50 bottom-10 right-10 block mt-2 mb-2 rounded-lg  bg-gray-800 px-8 py-3 text-center text-sm text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 disabled:bg-gray-100 md:text-base">プレビュー非表示</button>}

                {!isDemoMode && <button onClick={onSave} disabled={isLoading} className="mt-4 block w-full rounded-lg bg-blue-800 px-8 py-3 text-center text-sm text-white outline-none ring-blue-300 transition duration-100 hover:bg-blue-700 focus-visible:ring active:bg-blue-600 disabled:bg-blue-100 md:text-base">Query Engine更新</button>}
                {putQueryMessage && <p className="text-red-500">{putQueryMessage}</p>}
                {!isDemoMode && <p className="mt-3 text-xs text-gray-600 dark:text-gray-600">入力した検索条件をQuery Engineに書き込みます。</p>}
                {putQueryCompletMessage && <p className="text-blue-500">{putQueryCompletMessage}</p>}
              </div>
            </div>


            {posts &&
              posts.map((post: Post, index) => (
                <div className="rounded-lg border mt-2 mb-1 max-w-screen-md mx-auto" key={index}>
                  <div className="flex flex-shrink-0 p-2 pb-0 ">
                    <div className="flex items-center">
                      {post.Avater &&
                        <div>
                          <img className="inline-block h-8 w-8 rounded-full" src={post.Avater} alt="" />
                        </div>
                      }
                      <div className="ml-3">
                        <p className="text-sm leading-6 font-medium text-gray-600">
                          {post.DisplayName}
                          <span className="text-sm leading-5 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150 ml-2">
                            @{post.Handle} {post.Time}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pl-12 pb-2">
                    {post.IsReply && <div className="text-sm text-gray-800">[↩︎返信]</div>}
                    <p className="width-auto text-sm text-gray-800 flex-shrink ">
                      {post.Text}
                    </p>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2'>
                    {post.Image && post.Image.map((imageRef: imageObject, index2) => (
                      <div className="m-1" key={index2} >
                        <img src={imageRef.thumb} alt={imageRef.alt} />
                      </div >
                    ))}
                  </div>

                </div>
              ))}

            {(isCanPublish && isBlueskyLogin) &&
              <div className="bg-white py-4 sm:py-4 lg:py-4">
                <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                  <div className="mx-auto max-w-lg rounded-lg border">
                    <div className="flex flex-col gap-4 p-4 md:p-4">
                      {agent.session && <p className=" text-gray-400 dark:text-gray-600">Bluesky Handle @{agent.session.handle} でログイン中</p>}
                      <p className="text-xs text-gray-400 dark:text-gray-600">作成した後にBlueskyのアプリからカスタムフィードを参照できるようにするには「公開」が必要です。一同公開すれば、説明文やアイコンを変更したい場合を除き、再度公開する必要はありません。公開を行うBlueskyアカウントは上に表示されているアカウントです。</p>
                      <div>
                        <input type="file" accept=".png, .jpg, .jpeg" className="mb-2 w-[300px] inline-block text-sm text-gray-800 sm:text-base" onChange={changeFeedAvatar} />
                        <p className="text-xs text-gray-400 dark:text-gray-600">フィードのアイコンがデフォルトのままでよい場合は、画像は不要です。現在の仕様上、公開する際は都度画像をアップロードしていただくようお願いします。</p>
                      </div>

                      <button onClick={onPublishFeed} disabled={isLoading} className="block rounded-lg bg-blue-800 px-8 py-3 text-center text-sm text-white outline-none ring-blue-300 transition duration-100 hover:bg-blue-700 focus-visible:ring active:bg-blue-600 disabled:bg-blue-100 md:text-base">公開</button>
                      <p className="text-xs text-gray-400 dark:text-gray-600">処理に時間がかかるので、一度押したらそのままお待ちください。</p>
                      <button onClick={onDeleteFeed} disabled={isLoading} className="block rounded-lg bg-red-800 px-8 py-3 text-center text-sm text-white outline-none ring-red-300 transition duration-100 hover:bg-red-700 focus-visible:ring active:bg-red-600 disabled:bg-red-100 md:text-base">公開の取り下げ</button>
                      <p className="text-xs text-gray-400 dark:text-gray-600">「公開」したカスタムフィードがプロフィールから非表示になります。Query Engineのサーバーは消えませんので、ご自身で削除ください。</p>
                      {publishMessage && <p className="text-red-500">{publishMessage}</p>}
                      {publishCompleteMessage && <p className="text-blue-500">{publishCompleteMessage}</p>}
                      <button onClick={onLogout} disabled={isLoading} className="block rounded-lg bg-write px-8 py-3 text-center border text-sm text-red-800 outline-red-800 ring-red-800 transition duration-100 hover:bg-red-200 focus-visible:ring active:bg-red-600 disabled:bg-red-100 md:text-base">Blueskyからログアウト</button>
                      <p className="text-xs text-gray-400 dark:text-gray-600">別のBlueskyアカウントで公開する場合はログインし直してください。</p>
                    </div>

                  </div>
                </div>
              </div>
            }
          </div>
        </div>


      }


    </main>
  );
}
