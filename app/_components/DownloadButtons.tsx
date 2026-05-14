'use client';

import { useEffect, useState } from 'react';

const URLS = {
  mac: 'https://github.com/jiangxide1124/freelancer-manager-releases/releases/latest/download/-Mac-Client.dmg',
  win: 'https://github.com/jiangxide1124/freelancer-manager-releases/releases/latest/download/-Win-Client.exe',
};

type OS = 'mac' | 'win' | 'unknown';

function detectOS(): OS {
  if (typeof window === 'undefined') return 'unknown';
  const ua = window.navigator.userAgent || '';
  if (/Mac|iPhone|iPad|iPod/i.test(ua)) return 'mac';
  if (/Win/i.test(ua)) return 'win';
  return 'unknown';
}

/**
 * OS 자동 감지 다운로드 버튼.
 * - 사용자 OS에 맞춰 "추천" 배지 표시
 * - 두 버튼 다 활성화 (사용자가 원하면 다른 OS도 받을 수 있게)
 * - Windows는 SmartScreen 안내 추가
 */
export default function DownloadButtons() {
  const [os, setOs] = useState<OS>('unknown');

  useEffect(() => {
    setOs(detectOS());
  }, []);

  const isWin = os === 'win';
  const isMac = os === 'mac';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {/* macOS */}
        <a
          href={URLS.mac}
          className={`relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-semibold transition-colors min-w-[260px] ${
            isMac
              ? 'bg-slate-100 hover:bg-white text-slate-900 ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          {isMac && (
            <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold tracking-wide">
              내 PC 추천
            </span>
          )}
          <span className="text-2xl"></span>
          <div className="text-left">
            <div className={`text-xs ${isMac ? 'text-slate-500' : 'text-slate-400'}`}>macOS (Apple Silicon)</div>
            <div className="text-base">⬇ DMG 다운로드</div>
          </div>
        </a>

        {/* Windows */}
        <a
          href={URLS.win}
          className={`relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-semibold transition-colors min-w-[260px] ${
            isWin
              ? 'bg-sky-100 hover:bg-sky-50 text-slate-900 ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          {isWin && (
            <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold tracking-wide">
              내 PC 추천
            </span>
          )}
          <span className="text-2xl">⊞</span>
          <div className="text-left">
            <div className={`text-xs ${isWin ? 'text-slate-500' : 'text-slate-400'}`}>Windows 10 / 11 (x64)</div>
            <div className="text-base">⬇ EXE 다운로드</div>
          </div>
        </a>
      </div>

      {/* Windows 사용자에게만 표시되는 SmartScreen 안내 */}
      {isWin && (
        <div className="mt-2 max-w-xl text-xs text-amber-200 bg-amber-900/30 border border-amber-700/50 rounded-md px-4 py-3 leading-relaxed">
          <p className="font-semibold mb-1">⚠️ 처음 실행 시 Windows 경고가 나오면</p>
          <p>
            <strong>Microsoft Defender SmartScreen</strong>이 "확인되지 않은 앱"이라며 차단할 수 있어요.
            왼쪽 위 <strong>"추가 정보"</strong>를 클릭한 다음 아래에 나오는{' '}
            <strong>"실행"</strong> 버튼을 누르면 정상 작동합니다. (한 번만 허용하면 그 다음부터는 자동)
          </p>
        </div>
      )}
    </div>
  );
}
