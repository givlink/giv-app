import React from 'react'

export default function Invite() {
  //@Todo

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="flex-1"></div>
      <img src="/image/giv_logo.png" alt="Giv" width="90" className="mb-12" />
      <span>招待コードを入力してください</span>
      <input placeholder="招待コード" type="text" className="w-64 text-lg rounded py-4 px-4 mb-9" />
      <a
        href="https://giv.link/"
        target="_blank"
        rel="noreferrer"
        className="w-64 underline text-center"
      >
        招待コードを取得するにはこちらからご登録ください。
      </a>
      <div className="flex-1"></div>
      <button className="px-6 py-3 w-2/3 bg-giv-blue text-white rounded-lg font-medium mb-8">
        次へ
      </button>
    </div>
  )
}
