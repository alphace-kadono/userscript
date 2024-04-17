// ==UserScript==
// @name         RMS Login
// @description  RMS 自動ログイン
// @version      2024/04/17
// @updateURL    https://github.com/alphace-kadono/userscript/raw/main/ec/rms_login.user.js
// @match        https://glogin.rms.rakuten.co.jp/*
// @match        https://mainmenu.rms.rakuten.co.jp/?act=*
// @icon         https://jp.rakuten-static.com/1/im/ci/rakuten/favicon/cr.ico
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @require      https://raw.github.com/odyniec/MonkeyConfig/master/monkeyconfig.js
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// ==/UserScript==

(() => {
  'use strict';

  /**
   * MonkeyConfig の設定
   *
   * https://stackoverflow.com/questions/14594346/create-a-config-or-options-page-for-a-greasemonkey-script
   */
  const mConfig = new MonkeyConfig({
    title: 'RMS',
    menuCommand: true,
    params: {
      'rlogin-username-ja': {
        type: 'text',
        label: 'R-Login ID',
      },
      'rlogin-password-ja': {
        type: 'text',
        label: 'R-Login パスワード',
      },
      'rlogin-username-2-ja': {
        type: 'text',
        label: 'ユーザID',
      },
      'rlogin-password-2-ja': {
        type: 'text',
        label: 'パスワード',
      },
    },
    onSave: (_) => confirm('設定が完了したら、ページを再読み込みしてください。'),
  });

  const login = () => {
    if ($('.rf-form-error').length > 0) {
      console.error('エラーメッセージあり。');
      mConfig.open();
      return;
    }

    if ($('#rlogin-username-ja').length > 0) {
      $('#rlogin-username-ja').val(mConfig.get('rlogin-username-ja'));
      $('#rlogin-password-ja').val(mConfig.get('rlogin-password-ja'));
    }

    if ($('#rlogin-username-2-ja').length > 0) {
      $('#rlogin-username-2-ja').val(mConfig.get('rlogin-username-2-ja'));
      $('#rlogin-password-2-ja').val(mConfig.get('rlogin-password-2-ja'));
    }

    $('button[name="submit"]').trigger('click');

    if ($('.rf-merchant-name').length > 0) {
      location.href = 'https://mainmenu.rms.rakuten.co.jp/?act=login&sp_id=1';
    }
  };

  const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

  /**
   * main エントリーポイント
   *
   */
  const main = async () => {
    await sleep(0.2 * 1000);

    if (location.href.includes('//glogin.rms.rakuten.co.jp')) {
      // ログイン試行回数をチェック
      const loginTriedCount = GM_getValue('rlogin_tried_count') || 0;
      GM_setValue('rlogin_tried_count', loginTriedCount + 1);

      if (loginTriedCount > 6) {
        alert('ログイン試行回数をオーバーしたので、処理を中断します。');
        return;
      }

      login();
    }

    if (location.href.includes('//mainmenu.rms.rakuten.co.jp/?act')) {
      GM_setValue('rlogin_tried_count', 0);
      $('button[type="submit"]').trigger('click');
    }
  };

  main();
})();
