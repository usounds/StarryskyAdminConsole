"use client"
export const runtime = 'edge';
import { useState } from "react";
import { TextareaAutosize } from '@mui/base';

export default function Home() {
  const [serverUrl, setServerUrl] = useState("https://");
  const [webPassKey, setWebPassKey] = useState("");
  const [editFeed, setEditFeed] = useState("starrysky01");

  const [key, setKey] = useState("");
  const [recordName, setRecordName] = useState("");
  const [query, setQuery] = useState("");
  const [inputRegex, setInputRegex] = useState("");
  const [invertRegex, setInvertRegex] = useState("");
  const [refresh, setRefresh] = useState("");
  const [lang, setLang] = useState("");
  const [labelDisable, setLabelDisable] = useState("");
  const [replyDisable, setReplyDisable] = useState("");
  const [imageOnly, setImageOnly] = useState("");
  const [includeAltText, setIncludeAltText] = useState("");
  const [initPost, setInitPost] = useState("");
  const [pinnedPost, setPinnedPost] = useState("");
  const [lastExecTime, setLastExecTime] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isServerEditable, setIsSerberEditable] = useState(true);

  const onLoad = async (): Promise<void> => {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serverUrl: serverUrl, authkey: webPassKey, key: editFeed })
    };

    try {
      const res = await fetch('/api/getQuery', requestOptions);
      console.log(res);
      if (res.status == 200) {
        let data = await res.json();
        console.log(data);
        setKey(data.key)
        setRecordName(data.recordName)
        setQuery(data.query)
        setInputRegex(data.inputRegex)
        setInvertRegex(data.invertRegex)
        setRefresh(data.refresh)
        setLang(data.lang)
        setLabelDisable(data.labelDisable)
        setReplyDisable(data.replyDisable)
        setImageOnly(data.imageOnly)
        setIncludeAltText(data.includeAltText)
        setInitPost(data.initPost)
        setPinnedPost(data.pinnedPost)
        setLastExecTime(data.lastExecTime)
        setIsEditing(true)
        setIsSerberEditable(false)
      } else {
        alert('ログインに失敗しました:' + res.status);
      }

    } catch (err) {
      alert(err)
    }
  }

  const onSave = async (): Promise<void> => {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
          key: key,
          recordName: recordName,
          query: query,
          inputRegex: inputRegex,
          invertRegex: invertRegex,
          authkey: webPassKey,
          refresh: refresh,
          lang: lang,
          labelDisable: labelDisable,
          replyDisable: replyDisable,
          imageOnly: imageOnly,
          includeAltText: includeAltText,
          initPost: initPost,
          pinnedPost: pinnedPost,
          serverUrl: serverUrl
        }
      )
    };

    try {
      const res = await fetch('/api/setQuery', requestOptions);
      console.log('return')
      if (res.status == 200) {
        const ret = await res.json();
        if (ret.res === 'OK') {
          alert('更新処理が成功しました')
        } else {
          alert('更新処理が失敗しました')

        }
      } else {
        alert('更新処理が失敗しました')

      }
    } catch (err) {

    }

  }

  return (
    <main >
      <div className="bg-white py-4 sm:py-4 lg:py-4">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-4 lg:text-3xl">Starrysky Admin Console</h2>

          <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg mb-3">Starryskyのご利用は、事前に<a href="https://blog.usounds.work/posts/starry-sky-01/" className="text-black">Query Engineの構築</a>が必要です。</p>
          <div className="mx-auto max-w-lg rounded-lg border">

            <div className="flex flex-col gap-4 p-4 md:p-8">
              <div>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Server URL</label>
                <input value={serverUrl} onChange={(event) => setServerUrl(event.target.value)} placeholder="YOURSERVER.com" name="email" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
              </div>
              <div>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Web Pass Keyword</label>
                <input type="password" value={webPassKey} onChange={(event) => setWebPassKey(event.target.value)} placeholder="EDIT_WEB_PASSKEYの設定値" name="password" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
              </div>
              <div>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Edit Custom Feed</label>
                <select value={editFeed} onChange={(event) => { setEditFeed(event.target.value); setIsEditing(false); }} className="py-3 px-4 pe-9 border-2 block w-full bg-gray-50 ring-indigo-300 text-gray-800 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none ">
                  <option>starrysky01</option>
                  <option>starrysky02</option>
                </select>
                <p className="mt-3 text-xs text-gray-600 dark:text-gray-600">編集するカスタムフィードを選択します。</p>
              </div>

              <button onClick={onLoad} className="block rounded-lg bg-blue-800 px-8 py-3 text-center text-sm text-white outline-none ring-blue-300 transition duration-100 hover:bg-blue-700 focus-visible:ring active:bg-blue-600 md:text-base">読み込み</button>
            </div>

          </div>
        </div>
      </div>

      {isEditing &&

        <div className="bg-white py-6 sm:py-8 lg:py-12">
          <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
            <div className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2 mb-5">
              <div className='mb-2'>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Record Name</label>
                <input value={recordName} onChange={(event) => setRecordName(event.target.value)} placeholder="YOURSERVER.com" name="email" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">通常は変更不要です</p>
              </div>

              <div>
                <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">言語フィルタ</label>
                <input value={lang} onChange={(event) => setLang(event.target.value)} placeholder="ja" name="email" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">日本語に絞り込む場合は「ja」と入力します。複数指定する場合は[,]で区切ります。絞り込みを行わない場合は入力不要です。</p>
              </div>


            </div>

            <div className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2 mb-5">
              <div>
                <div className='text-gray-800'>Refresh</div>
                <div className="py-2 px-3 bg-gray-100 rounded-lg dark:bg-slate-700" data-hs-input-number>
                  <div className="w-full flex justify-between items-center gap-x-5">
                    <div className="grow">
                      <input value={refresh} onChange={(event) => setRefresh(event.target.value)} className="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 dark:text-white" type="text" data-hs-input-number-input />
                    </div>
                    <div className="flex justify-end items-center gap-x-1.5">
                      <button type="button" className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-input-number-decrement>
                        <svg className="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /></svg>
                      </button>
                      <button type="button" className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-input-number-increment>
                        <svg className="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">ここにマイナスな数を入力すると、その件数登録済みの投稿が削除され、再度正規表現の処理を行います。</p>
              </div>

              <div>
                <div className='text-gray-800'>初期取り込み件数</div>
                <div className="py-2 px-3 bg-gray-50 rounded-lg " data-hs-input-number>
                  <div className="w-full flex justify-between items-center gap-x-5">
                    <div className="grow">
                      <input value={initPost} onChange={(event) => setInitPost(event.target.value)} className="border w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0" type="text" data-hs-input-number-input />
                    </div>
                    <div className="flex justify-end items-center gap-x-1.5 border-1">
                      <button type="button" className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-input-number-decrement>
                        <svg className="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /></svg>
                      </button>
                      <button type="button" className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-input-number-increment>
                        <svg className="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">最初の処理において取り込む件数を指定します。</p>
              </div>
            </div>

            <div className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2 mb-5">
              <div>
                <div><label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">成人向けコンテンツ<br /></label></div>
                <div className="flex gap-x-6">
                  <div className="flex">
                    <input value="false" checked={labelDisable === "false"} onChange={(event) => setLabelDisable(event.target.value)} type="radio" name="label-radio-group" className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-radio-group-1" />
                    <label className="text-sm text-gray-500 ms-2 dark:text-gray-800">表示する</label>
                  </div>

                  <div className="flex">
                    <input value="true" checked={labelDisable === "true"} onChange={(event) => setLabelDisable(event.target.value)} type="radio" name="label-radio-group" className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-radio-group-2" />
                    <label className="text-sm text-gray-500 ms-2 dark:text-gray-800">表示しない</label>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">センシティブ設定された投稿の表示を切り替えます</p>
              </div>

              <div>
                <div>
                  <div><label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">リプライ<br /></label></div>
                  <div className="flex gap-x-6">
                    <div className="flex">
                      <input value="false" checked={replyDisable === "false"} onChange={(event) => setReplyDisable(event.target.value)} type="radio" name="reply-radio-group" className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-radio-group-1" />
                      <label className="text-sm text-gray-500 ms-2 dark:text-gray-800">表示する</label>
                    </div>

                    <div className="flex">
                      <input value="true" checked={replyDisable === "true"} onChange={(event) => setReplyDisable(event.target.value)} type="radio" name="reply-radio-group" className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-radio-group-2" />
                      <label className="text-sm text-gray-500 ms-2 dark:text-gray-800">表示しない</label>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">リプライの表示を切り替えます。</p>
                </div>
              </div>
            </div>


            <div className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2 mb-5">
              <div>
                <div><label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">画像のみ表示<br /></label></div>
                <div className="flex gap-x-6">
                  <div className="flex">
                    <input value="false" checked={imageOnly === "false"} onChange={(event) => setImageOnly(event.target.value)} type="radio" name="imags-radio-group" className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-radio-group-1" />
                    <label className="text-sm text-gray-500 ms-2 dark:text-gray-800">全て表示</label>
                  </div>

                  <div className="flex">
                    <input value="true" checked={imageOnly === "true"} onChange={(event) => setImageOnly(event.target.value)} type="radio" name="imags-radio-group" className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-radio-group-2" />
                    <label className="text-sm text-gray-500 ms-2 dark:text-gray-800">画像付き投稿のみ</label>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">画像つきの投稿を切り替えます</p>
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
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">画像のALTに設定された文字を検索するかを切り替えます</p>
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
                <button onClick={onSave} className="block rounded-lg bg-blue-800 px-8 py-3 text-center text-sm text-white outline-none ring-blue-300 transition duration-100 hover:bg-blue-700 focus-visible:ring active:bg-blue-600 md:text-base">Query Engine更新</button>
                <p className="mt-3 text-xs text-gray-600 dark:text-gray-600">入力した内容をQuery Engineに書き込みます。</p>
              </div>
            </div>


          </div>
        </div>
      }


      
      <footer className="bg-gray-900">
      <div className="text-sm text-gray-400 lg:mt-0 dark:text-gray-400 container flex flex-col items-center justify-between px-2 py-4 mx-auto lg:flex-row">
        <div>ver.2024-02-26</div>

        <div className="text-sm text-gray-100 flex flex-wrap items-center justify-center gap-4 mt-6 lg:gap-6 lg:mt-0">
            <a href='https://blog.usounds.work/posts/starry-sky-01/' target='_blank'>Query Engineセットアップ</a>
        </div>

        <div className="text-sm text-gray-100 flex flex-wrap items-center justify-center gap-4 mt-6 lg:gap-6 lg:mt-0">
            <a href='https://github.com/usounds/StarryskyQueryEngine' target='_blank'>GitHub(Query Engine)</a>
        </div>

        <div className="text-sm text-gray-100 flex flex-wrap items-center justify-center gap-4 mt-6 lg:gap-6 lg:mt-0">
            <a href='https://github.com/usounds' target='_blank'>GitHub(Admin Console)</a>
        </div>

        <div className="text-sm text-gray-100 flex flex-wrap items-center justify-center gap-4 mt-6 lg:gap-6 lg:mt-0">
            <a href='https://www.buymeacoffee.com/usounds' target='_blank'>buymeacoffee</a>
        </div>

        <div className="mt-6 text-sm text-gray-400 lg:mt-0 dark:text-gray-400">© Copyright 2024 usounds. </div>
      </div>
      </footer>

    </main>
  );
}
