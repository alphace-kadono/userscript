// ==UserScript==
// @name         RMS add Backlog Issue
// @namespace    npm/vite-plugin-monkey
// @version      0.0.0
// @author       monkey
// @description  RMS 受注データを Backlog の課題に追加する
// @updateURL    https://github.com/alphace-kadono/userscript/raw/main/ec/rms_login.user.js
// @match        https://order-rp.rms.rakuten.co.jp/order-rb/individual-order-detail-sc/*
// @require      https://raw.github.com/odyniec/MonkeyConfig/master/monkeyconfig.js
// @require      data:application/javascript,window.MonkeyConfig%3DMonkeyConfig
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.29/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.7.6/dist/index.full.min.js
// @resource     element-plus/dist/index.css  https://cdn.jsdelivr.net/npm/element-plus@2.7.6/dist/index.css
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" [data-v-f79a8fb5]{--el-color-danger: #ba0000;--el-color-danger-light-3: #dd2233;--defaultColorLink: #00836b;--backgroundColorHover: #fcfade}.el-loading-text{font-size:200%!important;font-weight:500!important}.el-input[data-v-f79a8fb5]{--el-input-border-color: var(--defaultColorLink)}.el-result[data-v-f79a8fb5]{--el-result-icon-font-size: 48px}.el-text--large[data-v-f79a8fb5]{--el-text-font-size: 2rem}.el-link[data-v-f79a8fb5]{--el-link-font-size: 2rem}.text-3xl[data-v-f79a8fb5]{font-size:1.875rem;line-height:2.25rem}.text-4xl[data-v-f79a8fb5]{font-size:2.25rem;line-height:2.5rem}.right-top[data-v-f79a8fb5]{position:fixed;top:100px;right:10px;z-index:1000}.right-top-container[data-v-f79a8fb5]{text-align:right;position:fixed;top:100px;right:10%;padding:2rem;background-color:#f0f0f0;border-radius:var(--el-border-radius-base);z-index:1001}.bl-summary[data-v-f79a8fb5]{min-width:60rem;margin:1rem 0} ");

(function (vue, ElementPlus) {
  'use strict';

  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("element-plus/dist/index.css");
  /*! Element Plus Icons Vue v2.3.1 */
  var arrow_left_bold_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "ArrowLeftBold",
    __name: "arrow-left-bold",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M685.248 104.704a64 64 0 0 1 0 90.496L368.448 512l316.8 316.8a64 64 0 0 1-90.496 90.496L232.704 557.248a64 64 0 0 1 0-90.496l362.048-362.048a64 64 0 0 1 90.496 0z"
        })
      ]));
    }
  });
  var arrow_left_bold_default = arrow_left_bold_vue_vue_type_script_setup_true_lang_default;
  var arrow_right_bold_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "ArrowRightBold",
    __name: "arrow-right-bold",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M338.752 104.704a64 64 0 0 0 0 90.496l316.8 316.8-316.8 316.8a64 64 0 0 0 90.496 90.496l362.048-362.048a64 64 0 0 0 0-90.496L429.248 104.704a64 64 0 0 0-90.496 0z"
        })
      ]));
    }
  });
  var arrow_right_bold_default = arrow_right_bold_vue_vue_type_script_setup_true_lang_default;
  var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
  var _monkeyWindow = /* @__PURE__ */ (() => window)();
  const mConfig = new _monkeyWindow.MonkeyConfig({
    // https://raw.github.com/odyniec/MonkeyConfig/master/monkeyconfig.js
    title: "ユーザー個別の設定",
    menuCommand: true,
    params: {
      "api-key": {
        type: "text",
        label: "Backlog の API key"
      },
      "gas-url": {
        type: "text",
        label: "GAS の URL"
      }
    }
    // onSave: (_: any) =>
    //   confirm('設定が完了したら、ページを再読み込みしてください。'),
  });
  const isConfigSet = (mConfig2) => {
    return mConfig2.get("api-key") !== "" && mConfig2.get("gas-url") !== "";
  };
  const _x = (STR_XPATH) => {
    const xresult = document.evaluate(
      STR_XPATH,
      document,
      null,
      XPathResult.ANY_TYPE,
      null
    );
    const xnodes = [];
    let xres;
    while (xres = xresult.iterateNext()) {
      xnodes.push(xres);
    }
    return xnodes;
  };
  const getOrder = async () => {
    const type = "rakuten";
    const selectors = {
      /* 楽天 RMS */
      rakuten: {
        名前: '//div[@class="rms-content-order-details-contact-info col-sm-12 rms-clear-padding"]//*[@class="fullname"]',
        フリガナ: '//div[@class="rms-content-order-details-contact-info col-sm-12 rms-clear-padding"]//*[@class="furigana"]',
        住所: '//div[@class="rms-content-order-details-contact-info col-sm-12 rms-clear-padding"]//*[@class="address"]',
        電話番号: '//div[@class="rms-content-order-details-contact-info col-sm-12 rms-clear-padding"]//*[@class="phone"]',
        受注番号: '//a[@class="rms-status-order-nr"]',
        注文日時: '//td[contains(text(), "注文日時")]/following-sibling::td[1]',
        支払方法: '//div[@class="rms-col-70-percent"]/p/span[contains(text(), "クレジット") or contains(text(), "振込") or contains(text(), "払")]',
        支払区分: '//td[contains(text(), "支払い回数")]/following-sibling::td[1]',
        配送日時指定: '//div[@class="rms-col-70-percent"]/p/span[starts-with(text(), "202") and contains(text(), "/")]',
        送料: '//tr[@class="summary-footer"]//td[4]//div[3]/span',
        ポイント利用: '//td[./span[.="ポイント利用額"]]/following-sibling::td[1]/span',
        クーポン利用: '//table[@class="rms-content-order-details-billing-details-table"]//tr[not(@class="highlight")]//td[.//span[contains(text(), "クーポン")]]',
        "合計(税込)": '//td//span[@class="rms-price-tag"]',
        商品: '//tr[@class="opp-thick-border-green"]//td[1]',
        商品URL: '//div[@class="rms-table-column-line"]//a[contains(@href, "item.rakuten.co.jp")]',
        商品個数: '//div[@class="rms-content-order-details-block-destination-overview-table"]//td[8]',
        "商品金額(税込)": '//div[@class="rms-content-order-details-block-destination-overview-table"]//td[9]',
        注文者住所: '//div[@class="rms-content-order-details-contact-info"]//div[@class="rms-content-order-details-contact-info-contact-options"]/span[@class="address"]',
        注文者名前: '//div[@class="rms-content-order-details-contact-info"]//span[@class="fullname"]',
        注文者フリガナ: '//div[@class="rms-content-order-details-contact-info"]//span[@class="furigana"]',
        注文者電話番号: '//div[@class="rms-content-order-details-contact-info"]//span[@class="phone"]'
      },
      /* Yahoo */
      yahoo: {
        郵便番号: '//div[@class="ReceAdd"]//th[.="郵便番号"]/following-sibling::td[1]//p',
        住所: '//div[@class="ReceAdd"]//th[.="住所"]/following-sibling::td[1]//p',
        名前: '//div[@class="ReceAdd"]//th[.="氏名"]/following-sibling::td[1]//span',
        フリガナ: '//div[@class="ReceAdd"]//th[.="氏名カナ"]/following-sibling::td[1]//p',
        電話番号: '//div[@class="ReceAdd"]//th[.="電話番号"]/following-sibling::td[1]//p',
        受注番号: '//p[contains(text(),"ec-furniture-")]',
        注文日時: '//div[@id="ordBasic"]//tr[1]//td[2]//div[1]//p[1]',
        支払方法: '//th[.="お支払方法"]/following-sibling::td[1]//p',
        支払区分: '//th[.="お支払区分"]/following-sibling::td[1]//p',
        配送日時指定: '//div[@class="ReceMeth"]//th[.="お届け希望日"]/following-sibling::td[1]//p',
        送料: '//th[.="送料"]/following-sibling::td[1]',
        手数料: '//th[.="手数料"]/following-sibling::td[1]',
        ポイント利用: '//th[.="ポイント利用分"]/following-sibling::td[1]',
        クーポン利用: '//th[.="クーポン値引き"]/following-sibling::td[1]',
        クーポン原資: '//th[.="クーポン原資元"]/following-sibling::td[1]',
        "合計(税込)": '//th[.="請求金額（税込）"]/following-sibling::td[1]//p',
        商品: '//td[@class="itemName"]',
        商品URL: '//td[@class="itemName"]/p[1]/a[1]',
        注文者郵便番号: '//div[@class="Orderer"]//th[.="郵便番号"]/following-sibling::td[1]//p',
        注文者住所: '//div[@class="Orderer"]//th[.="住所"]/following-sibling::td[1]//p',
        注文者名前: '//div[@class="Orderer"]//th[.="氏名"]/following-sibling::td[1]//p',
        注文者フリガナ: '//div[@class="Orderer"]//th[.="氏名カナ"]/following-sibling::td[1]//p',
        注文者電話番号: '//div[@class="Orderer"]//th[.="電話番号"]/following-sibling::td[1]//p',
        備考: '//th[.="ご要望"]/following-sibling::td[1]//pre'
      }
    };
    const values = {
      ショップ: type == "rakuten" ? "楽天" : "Yahoo!"
    };
    $.each(selectors[type], function(key, selector) {
      let value;
      const item = $(_x(selector));
      if (item.html() !== void 0 && item.html().includes("<br")) {
        const replace = item.html().replace(/<br[\s/]*>/gi, " ");
        item.html(replace);
      }
      value = item.text() || item.val();
      if (key.indexOf("URL") !== -1) {
        value = item.attr("href");
      }
      if (key == "商品") {
        value = value.replace(/\s{2,}/g, "\\n");
        value = value.replace(/^\\n/, "");
      }
      if (value !== void 0) {
        values[key] = value.trim();
      }
    });
    values["名前フリガナ"] = values["名前"] + "[" + values["フリガナ"] + "]様";
    values["注文者名前フリガナ"] = values["注文者名前"] + "[" + values["注文者フリガナ"] + "]様";
    if (values["クーポン利用"] !== void 0) {
      values["クーポン利用"] = values["クーポン利用"].replace(
        /\s{2,}/gm,
        " "
      );
    }
    if (values["クーポン原資"] !== void 0) {
      values["クーポン利用"] = values["クーポン利用"] + " " + values["クーポン原資"];
    }
    if (values["支払区分"] !== void 0) {
      values["支払方法"] = values["支払方法"] + " " + values["支払区分"];
    }
    values["受注URL"] = window.location.href;
    return values;
  };
  const makeRequest = (url, data, method = "POST", headers = { "Content-Type": "application/json" }) => {
    return new Promise((resolve, reject) => {
      _GM.xmlHttpRequest({
        method,
        headers,
        data: JSON.stringify(data),
        url,
        onload: (response) => {
          resolve(response.responseText);
        },
        onerror: (error) => {
          reject(error);
        }
      });
    });
  };
  const _hoisted_1 = {
    key: 0,
    class: "right-top-container"
  };
  const _hoisted_2 = {
    key: 0,
    class: "text-center"
  };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "Backlog",
    setup(__props) {
      const menuVisible = vue.ref(false);
      const toggleMenu = async () => {
        menuVisible.value = !menuVisible.value;
      };
      const menuModel = vue.computed(
        () => menuVisible.value ? {
          text: "🐵",
          icon: arrow_right_bold_default,
          tooltip: {
            content: "Monkey メニューを閉じる"
          }
        } : {
          text: "🙈",
          icon: arrow_left_bold_default,
          tooltip: {
            content: "Monkey メニューを開く"
          }
        }
      );
      const postData = vue.ref({ api_key: "", summary: "", order_data: {} });
      vue.watch(
        menuVisible,
        async (newValue, _) => {
          var _a;
          if (newValue === true) {
            const orderData = await getOrder();
            const _productName = ((_a = orderData["商品"].split("\\n")) == null ? void 0 : _a.at(0)) ?? "";
            const productName = _productName.replace(/(【.*】)/, "") ?? "";
            postData.value.summary = `${orderData["ショップ"]}／${orderData["名前"]}[${orderData["フリガナ"]}]様／${productName}`;
            postData.value.order_data = orderData;
          }
        },
        {
          once: true
          // immediate: true
        }
      );
      vue.watch(
        // watch メソッドでオブジェクトの特定プロパティを監視
        // https://zenn.dev/n4sh/articles/6c3a7f225dc25c
        () => postData.value.summary,
        (_) => {
          postData.value.summary = postData.value.summary.replace("\n", "");
        },
        { immediate: true }
      );
      vue.ref(false);
      const postResponse = vue.ref({
        done: false,
        isOk: true,
        isError: false,
        icon: "error",
        title: "",
        issueUrl: "",
        message: "エラーが発生しました🙉"
      });
      vue.watch(
        // watch メソッドでオブジェクトの特定プロパティを監視
        // https://zenn.dev/n4sh/articles/6c3a7f225dc25c
        () => postResponse.value.done,
        (_) => {
          postResponse.value.isError = !postResponse.value.isOk;
        },
        { immediate: true }
      );
      const addIssue = async () => {
        console.clear();
        if (!isConfigSet(mConfig)) {
          mConfig.open("layer");
          return;
        }
        if (!confirm("🐵 よろしいですか？")) {
          return;
        }
        const loading = ElementPlus.ElLoading.service({
          body: true,
          fullscreen: true,
          lock: true,
          text: "🙊 処理中です。。"
        });
        try {
          postResponse.value.done = false;
          const url = mConfig.get("gas-url");
          postData.value.api_key = mConfig.get("api-key");
          console.log("postData.value");
          console.log(postData.value);
          const _response = await makeRequest(url, postData.value);
          const response = JSON.parse(_response);
          postResponse.value.isOk = response.ok;
          if (response.ok) {
            postResponse.value.issueUrl = response.content.issueUrl;
          } else {
            postResponse.value.message = response.message;
          }
          console.log("response");
          console.log(response);
        } catch (e) {
          postResponse.value.isOk = false;
          if (e instanceof Error) {
            postResponse.value.message = e.message;
          }
        } finally {
          loading.close();
          postResponse.value.done = true;
        }
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(vue.unref(ElementPlus.ElTooltip), {
            placement: "top-start",
            content: menuModel.value.tooltip.content
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(vue.unref(ElementPlus.ElButton), {
                onClick: toggleMenu,
                class: "right-top text-4xl",
                type: "primary",
                icon: menuModel.value.icon,
                size: "large",
                round: ""
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(vue.toDisplayString(menuModel.value.text), 1)
                ]),
                _: 1
              }, 8, ["icon"])
            ]),
            _: 1
          }, 8, ["content"]),
          menuVisible.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
            vue.createVNode(vue.unref(ElementPlus.ElInput), {
              class: "bl-summary",
              type: "textarea",
              autosize: "",
              maxlength: "255",
              "show-word-limit": "",
              modelValue: postData.value.summary,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => postData.value.summary = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(vue.unref(ElementPlus.ElButton), {
              color: "#2c9a7a",
              onClick: addIssue
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(" Backlog に課題として追加 ")
              ]),
              _: 1
            }),
            postResponse.value.done ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [
              postResponse.value.isOk ? (vue.openBlock(), vue.createBlock(vue.unref(ElementPlus.ElResult), {
                key: 0,
                icon: "success",
                title: "作成されました🐵"
              })) : vue.createCommentVNode("", true),
              postResponse.value.isError ? (vue.openBlock(), vue.createBlock(vue.unref(ElementPlus.ElResult), {
                key: 1,
                icon: "error",
                title: "エラーが発生しました🙉"
              })) : vue.createCommentVNode("", true),
              postResponse.value.isOk ? (vue.openBlock(), vue.createBlock(vue.unref(ElementPlus.ElLink), {
                key: 2,
                href: postResponse.value.issueUrl,
                target: "_blank"
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(vue.toDisplayString(postResponse.value.issueUrl), 1)
                ]),
                _: 1
              }, 8, ["href"])) : vue.createCommentVNode("", true),
              postResponse.value.isError ? (vue.openBlock(), vue.createBlock(vue.unref(ElementPlus.ElText), {
                key: 3,
                size: "large"
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(vue.toDisplayString(postResponse.value.message), 1)
                ]),
                _: 1
              })) : vue.createCommentVNode("", true)
            ])) : vue.createCommentVNode("", true)
          ])) : vue.createCommentVNode("", true)
        ], 64);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const Backlog = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f79a8fb5"]]);
  const mountPoint = document.createElement("div");
  document.body.appendChild(mountPoint);
  const app = vue.createApp(Backlog);
  app.use(ElementPlus);
  app.mount(mountPoint);

})(Vue, ElementPlus);
