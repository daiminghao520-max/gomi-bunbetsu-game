/*
 * 日中韓ごみ分別ゲーム — データ
 * ------------------------------------------------------------
 * 国・ごみ箱・ごみ（問題）・絵（SVG）は ぜんぶ この ファイルに あります。
 * ゲームの しくみ（game.js）は さわらなくても、ここを 書きかえれば
 * 問題を ふやしたり 説明を かえたり できます。くわしくは README.md へ。
 *
 * 文字の 書きかた（name / desc / why などで 使えます）
 *   {漢字|かんじ}        → ふりがな つきの 漢字に なります
 *   [zh]湿垃圾[/zh]      → 中国語の フォントで 表示します
 *   [ko]일반쓰레기[/ko]  → 韓国語の フォントで 表示します
 */
window.GAME_DATA = {

  /* 1つの 国で 何問 出すか（ごみの 数が たりない ときは ある分だけ） */
  questionsPerStage: 8,

  /* ほかの 国の こたえが 'varies' の ときに 出す ことば */
  variesText: 'まちによって ちがう',

  /* ================================================================
   * 国（ステージ）
   *   bins の id は、下の items の answers で 使います。
   *   mustInclude … かならず 出す ごみの id
   * ================================================================ */
  countries: [
    {
      id: 'jp',
      name: '日本',
      short: '日本',
      place: 'あるまちの れい',
      color: '#e8603c',
      landmark: 'l_fuji',
      mustInclude: ['egg', 'toy'],
      intro: [
        '日本の ごみの 分けかたに チャレンジ！',
        'この まちでは、ごみを 4つに 分けるよ。'
      ],
      notice: '日本では、{市町村|しちょうそん}（まち）ごとに ルールが ちがうよ！ この ゲームは「あるまち」の れいだよ。',
      playNotice: '{市町村|しちょうそん}によって ルールが ちがうよ',
      bins: [
        {
          id: 'moeru', name: 'もえるごみ', color: '#e8603c', picto: 'p_flame',
          desc: '生ごみ・よごれた 紙 など',
          why: 'もやして しょりするよ。日本では 多くの ごみを もやして、ごみの かさを 小さく しているんだ。'
        },
        {
          id: 'moenai', name: 'もえないごみ', color: '#4f7cac', picto: 'p_noburn',
          desc: 'せともの・ガラス・小さな 金ぞく など',
          why: 'もやせない ものは、くだいて 金ぞくを 取り出したり、うめたてたり するよ。'
        },
        {
          id: 'pura', name: 'プラスチック', color: '#d39200', picto: 'p_pla',
          desc: 'プラマークの ついた ふくろ・ようき など',
          why: 'あつめて、もういちど プラスチックの ざいりょう などに するよ。'
        },
        {
          id: 'shigen', name: '{資源|しげん}ごみ', color: '#2e9d5b', picto: 'p_recycle',
          desc: 'かん・びん・ペットボトル・新聞 など',
          why: 'あらって 出すと、また 新しい ものに 生まれかわるよ（リサイクル）。'
        }
      ],
      points: [
        {
          title: 'ルールを きめるのは まち',
          text: '日本では、ほうりつで「家の ごみを しょりするのは {市町村|しちょうそん}の しごと」と きまっているよ。だから 分けかたも、ごみの 名前も、まちごとに ちがうんだ。'
        },
        {
          title: 'もやして 小さく する',
          text: '日本は 多くの ごみを もやして かさを へらし、うめたてる ばしょを 長もち させているよ。'
        }
      ],
      cityDiffTitle: 'ほかの まちでは どうかな？',
      cityDiff: [
        {
          icon: 'battery', title: 'かんでんち',
          text: '「{有害|ゆうがい}ごみ」の 日に 出す まちも あれば、お店や 市やくしょの「{回収|かいしゅう}ボックス」に 入れる まちも あるよ。'
        },
        {
          icon: 'toy', title: 'プラスチックの おもちゃ',
          text: 'この ゲームの まちでは「プラスチック」。でも「もえるごみ」に する まちも あるよ。'
        },
        {
          icon: 'trashbag', title: 'ごみの 名前',
          text: '「もえるごみ」を「{可燃|かねん}ごみ」「もやすごみ」と よぶ まちも あるよ。'
        }
      ],
      think: 'どうして まちごとに ルールが ちがうのかな？ ひっこしを したら、どんな ことに こまるかな？'
    },

    {
      id: 'sh',
      name: '{中国|ちゅうごく}・{上海|シャンハイ}',
      short: '上海',
      place: '',
      color: '#d6336c',
      landmark: 'l_pearl',
      mustInclude: ['egg', 'battery'],
      intro: [
        '{上海|シャンハイ}の ごみの 分けかたに チャレンジ！',
        'ごみを 4つに 分けるよ。ごみ箱の 色も きまっているよ。'
      ],
      notice: '2019年7月から、{上海|シャンハイ}では きまり（{条例|じょうれい}）で ごみを 分ける ことに なったよ。',
      playNotice: '',
      bins: [
        {
          id: 'recyclable', name: 'リサイクルできる もの', native: '[zh]可回收物[/zh]', reading: 'カー ホイショウ ウー',
          color: '#1e6fd9', picto: 'p_recycle',
          desc: '紙・プラスチック・ガラス・金ぞく・服 など',
          why: 'きれいに して、かわかして 出すと、また 使えるよ。'
        },
        {
          id: 'hazardous', name: '{有害|ゆうがい}な ごみ', native: '[zh]有害垃圾[/zh]', reading: 'ヨウハイ ラージー',
          color: '#d63031', picto: 'p_hazard',
          desc: 'くすり・けいこうとう・じゅうでんち など',
          why: '体や しぜんに わるい ものが 入っているので、べつに あつめて ていねいに しょりするよ。'
        },
        {
          id: 'wet', name: 'しめった ごみ', native: '[zh]湿垃圾[/zh]', reading: 'シー ラージー',
          color: '#8d5524', picto: 'p_drop',
          desc: '生ごみ・くだものの 皮・お茶がら など',
          why: 'くさりやすい 生ごみは、ひりょうや ガス（エネルギー）に かえるよ。'
        },
        {
          id: 'dry', name: 'かわいた ごみ', native: '[zh]干垃圾[/zh]', reading: 'ガン ラージー',
          color: '#2d3436', picto: 'p_dry',
          desc: 'ほかの 3つに 入らない もの',
          why: 'もやして、その ねつで 電気を つくるよ。'
        }
      ],
      points: [
        {
          title: '国が もとを きめる',
          text: '中国では 国が「ごみを 4つに 分ける」という もとの ルールを きめて、2017年から 46の 大きな 都市で 先に はじめたよ。'
        },
        {
          title: 'よび名は 上海ふう',
          text: '国の ルールでは「台所の ごみ（[zh]厨余垃圾[/zh]）」「その ほかの ごみ（[zh]其他垃圾[/zh]）」と いうけど、上海では「しめった ごみ」「かわいた ごみ」と よぶよ。'
        },
        {
          title: 'かたい ものは「かわいた ごみ」',
          text: '大きな ほねや 貝がらは かたくて くさりにくく、しょりする きかいを こわして しまうので「かわいた ごみ」なんだ。'
        }
      ],
      think: '上海では たまごの からは「しめった ごみ」。韓国では「ふつうの ごみ」。どうして ちがうのかな？'
    },

    {
      id: 'kr',
      name: '{韓国|かんこく}・ソウル',
      short: 'ソウル',
      place: '',
      color: '#2f6fdf',
      landmark: 'l_tower',
      mustInclude: ['egg', 'banana'],
      intro: [
        'ソウルの ごみの 分けかたに チャレンジ！',
        'ここでは 4つに 分けるよ。（ほんとうは リサイクルを もっと こまかく、紙・かん・びん・プラ・ビニール などに 分けるよ。）'
      ],
      notice: '{韓国|かんこく}では 1995年から 国 全体で「ごみ{従量制|じゅうりょうせい}」。ふつうの ごみは、お金を はらって 買う ふくろに 入れて 出すよ。',
      playNotice: '',
      bins: [
        {
          id: 'general', name: 'ふつうの ごみ', native: '[ko]일반쓰레기[/ko]', reading: 'イルバン スレギ',
          color: '#6c7a89', picto: 'p_bag',
          desc: 'お金を はらって 買う「ゆうりょうの ふくろ」に 入れる',
          why: 'ごみが 多いほど ふくろ代が かかるので、みんな ごみを へらそうと するよ。'
        },
        {
          id: 'food', name: '生ごみ', native: '[ko]음식물 쓰레기[/ko]', reading: 'ウムシンムル スレギ',
          color: '#c77c02', picto: 'p_food',
          desc: 'どうぶつの えさや ひりょうに なる もの',
          why: '生ごみは、どうぶつの えさや ひりょうに するよ。水を よく 切って 出してね。'
        },
        {
          id: 'recycle', name: 'リサイクル', native: '[ko]재활용품[/ko]', reading: 'チェファリョンプム',
          color: '#1e8e5a', picto: 'p_recycle',
          desc: '紙・かん・びん・プラ・ビニール など',
          why: '{種類|しゅるい}ごとに 分けて 出すよ。リサイクルの ごみには、ふくろ代が かからないよ。'
        },
        {
          id: 'special', name: '{専用|せんよう}ボックス', native: '[ko]전용 수거함[/ko]', reading: 'チョニョン スゴハム',
          color: '#c0392b', picto: 'p_battery',
          desc: 'でんち・けいこうとう・くすり',
          why: 'まぜると あぶなかったり、しぜんを よごしたり するので、まちに ある {専用|せんよう}の ボックスに 入れるよ。'
        }
      ],
      points: [
        {
          title: '国 全体で 同じ しくみ',
          text: '1995年に 国が「ごみ{従量制|じゅうりょうせい}」を はじめたよ。出す ごみの {量|りょう}で お金が かわるので、ごみを へらして リサイクルする 人が ふえたんだ。'
        },
        {
          title: '生ごみは えさや ひりょうに',
          text: '生ごみは 2013年から 国 全体で、出した {量|りょう}に あわせて お金を はらう しくみに なったよ。えさや ひりょうに するので、ほね・から・たね など かたくて くさりにくい ものは「ふつうの ごみ」なんだ。'
        },
        {
          title: 'ペットボトルは べつに',
          text: 'とうめいな ペットボトルは、ラベルを はがして つぶし、ほかの プラと 分けて 出すよ（2020年から）。'
        }
      ],
      think: '{韓国|かんこく}の 生ごみに、たまごの からや ほねを 入れないのは どうしてだと 思う？'
    }
  ],

  /* ================================================================
   * ごみ（問題）
   *   answers … 国の id: その国の ごみ箱の id
   *             その国で 出したくない ときは 書かない
   *             'varies' … 問題には 出さず、「まちによって ちがう」と 表示だけ
   *   why     … こたえの あとに 出る「なぜ？」（書かないと ごみ箱の why が 出る）
   *   notes   … 「まちによって ちがう！」などの 注意（なくても よい）
   *   icon    … 下の icons の 名前
   * ================================================================ */
  items: [
    {
      id: 'banana', name: 'バナナの 皮', icon: 'banana',
      answers: { jp: 'moeru', sh: 'wet', kr: 'food' },
      why: {
        jp: '生ごみは もえるごみ。水を よく 切ってから 出そう。',
        sh: 'くだものの 皮は「しめった ごみ」。ひりょうや ガスに なるよ。',
        kr: 'やわらかい くだものの 皮は 生ごみ。どうぶつの えさや ひりょうに なるよ。'
      }
    },
    {
      id: 'egg', name: 'たまごの から', icon: 'egg',
      answers: { jp: 'moeru', sh: 'wet', kr: 'general' },
      why: {
        jp: '日本では、生ごみと いっしょに もえるごみ。',
        sh: '{上海|シャンハイ}では たまごの からは「しめった ごみ」だよ。',
        kr: '{韓国|かんこく}では たまごの からは 生ごみに 入れないよ！ かたくて くさりにくく、えさや ひりょうに ならないので「ふつうの ごみ」。'
      }
    },
    {
      id: 'bigbone', name: '大きな ほね（ぶたの ほね）', icon: 'bigbone',
      answers: { jp: 'moeru', sh: 'dry', kr: 'general' },
      why: {
        jp: 'ほねも もえるごみだよ。',
        sh: '大きな ほねは かたくて くさりにくく、しょりする きかいを こわして しまうので「かわいた ごみ」。',
        kr: 'かたい ほねは えさや ひりょうに ならないので「ふつうの ごみ」。'
      }
    },
    {
      id: 'fishbone', name: '魚の ほね', icon: 'fishbone',
      answers: { jp: 'moeru', sh: 'wet' },
      why: {
        sh: '魚の ほねは「しめった ごみ」。大きな ほねとは ちがう 箱だよ！'
      }
    },
    {
      id: 'chickenbone', name: 'とりの ほね', icon: 'chickenbone',
      answers: { jp: 'moeru', kr: 'general' },
      why: {
        kr: 'とりの ほねも「ふつうの ごみ」。くさりにくい ものは、えさや ひりょうの じゃまに なるんだ。'
      }
    },
    {
      id: 'shell', name: '貝がら', icon: 'shell',
      answers: { sh: 'dry', kr: 'general' },
      why: {
        sh: '貝がらは かたくて くさりにくいので「かわいた ごみ」。',
        kr: '貝がらは かたいので「ふつうの ごみ」。'
      }
    },
    {
      id: 'peachpit', name: 'ももの たね', icon: 'peachpit',
      answers: { jp: 'moeru', kr: 'general' },
      why: {
        kr: 'ももの たねは とても かたいので「ふつうの ごみ」。生ごみを しょりする きかいが こわれて しまうよ。'
      }
    },
    {
      id: 'tea', name: 'お茶がら（使った お茶の 葉）', icon: 'tea',
      answers: { jp: 'moeru', sh: 'wet', kr: 'general' },
      why: {
        jp: '水を 切って もえるごみへ。',
        sh: 'お茶の 葉は「しめった ごみ」だよ。',
        kr: '{韓国|かんこく}では お茶がらは「ふつうの ごみ」！ 生ごみには 入れないんだ。'
      }
    },
    {
      id: 'tissue', name: '使った ティッシュ', icon: 'tissue',
      answers: { jp: 'moeru', sh: 'dry', kr: 'general' },
      why: {
        jp: 'よごれた 紙は リサイクル できないので もえるごみ。',
        sh: 'よごれた 紙は リサイクル できないので「かわいた ごみ」。',
        kr: 'お金を はらって 買う ふくろに 入れる「ふつうの ごみ」。'
      }
    },
    {
      id: 'diaper', name: '紙おむつ', icon: 'diaper',
      answers: { jp: 'moeru', sh: 'dry', kr: 'general' },
      why: {
        jp: 'よごれは トイレに ながしてから、もえるごみへ。',
        sh: 'いろいろな ざいりょうが まざっていて リサイクル できないので「かわいた ごみ」。'
      }
    },
    {
      id: 'leftover', name: '食べのこした ごはん', icon: 'leftover',
      answers: { jp: 'moeru', sh: 'wet', kr: 'food' },
      why: {
        kr: '生ごみは えさや ひりょうに なるよ。でも、食べのこしを へらすのが いちばん！'
      }
    },
    {
      id: 'apple', name: 'りんごの しん', icon: 'apple',
      answers: { jp: 'moeru', sh: 'wet', kr: 'food' }
    },
    {
      id: 'watermelon', name: 'すいかの 皮', icon: 'watermelon',
      answers: { jp: 'moeru', sh: 'wet', kr: 'food' },
      why: {
        kr: '小さく 切って、水を よく 切ってから 生ごみへ。'
      }
    },
    {
      id: 'cornhusk', name: 'とうもろこしの 皮', icon: 'cornhusk',
      answers: { jp: 'moeru', sh: 'dry' },
      why: {
        sh: 'とうもろこしの 皮は せんいが 長くて、きかいに からまって しまうので「かわいた ごみ」。でも しんは「しめった ごみ」！'
      }
    },
    {
      id: 'corncob', name: 'とうもろこしの しん', icon: 'corncob',
      answers: { jp: 'moeru', sh: 'wet' },
      why: {
        sh: 'しんは くさりやすいので「しめった ごみ」。皮とは ちがう 箱だよ！'
      }
    },
    {
      id: 'pet', name: 'ペットボトル', icon: 'pet',
      answers: { jp: 'shigen', sh: 'recyclable', kr: 'recycle' },
      why: {
        jp: 'キャップと ラベルを はずして、中を あらって 出すよ。',
        sh: '中を からに して、つぶして 出すよ。',
        kr: 'ラベルを はがして つぶし、キャップを しめて 出すよ。とうめいな ペットボトルは ほかの プラと 分けるんだ。'
      }
    },
    {
      id: 'can', name: 'ジュースの かん', icon: 'can',
      answers: { jp: 'shigen', sh: 'recyclable', kr: 'recycle' },
      why: {
        jp: '中を あらって 出すよ。',
        sh: 'かんは とかすと、また アルミの かたまりに なるよ。'
      }
    },
    {
      id: 'newspaper', name: '古い 新聞', icon: 'newspaper',
      answers: { jp: 'shigen', sh: 'recyclable', kr: 'recycle' },
      why: {
        jp: 'ひもで しばって 出すよ。また 紙に 生まれかわるよ。',
        sh: '紙は たいらに して 出すよ。'
      }
    },
    {
      id: 'milk', name: '{牛乳|ぎゅうにゅう}パック', icon: 'milk',
      answers: { jp: 'shigen', sh: 'recyclable', kr: 'recycle' },
      why: {
        jp: 'あらって、ひらいて、かわかして 出すよ。',
        sh: '紙と プラ などが くっついた パックも「リサイクルできる もの」。',
        kr: '紙パックは、新聞などの 紙とは 分けて 出すよ。'
      }
    },
    {
      id: 'snack', name: 'おかしの ふくろ', icon: 'snack',
      answers: { jp: 'pura', kr: 'recycle' },
      why: {
        jp: 'プラマークが ついて いるので「プラスチック」へ。',
        kr: 'おかしの ふくろも「ビニール」として リサイクル するよ。'
      }
    },
    {
      id: 'cup', name: 'プリンの カップ', icon: 'cup',
      answers: { jp: 'pura', kr: 'recycle' },
      why: {
        jp: '中を かるく あらって「プラスチック」へ。',
        kr: '中を あらって、プラスチックとして リサイクル。'
      }
    },
    {
      id: 'toy', name: 'プラスチックの おもちゃ', icon: 'toy',
      answers: { jp: 'pura', sh: 'recyclable' },
      notes: {
        jp: 'まちに よっては「もえるごみ」に する ところも あるよ！'
      },
      why: {
        jp: 'この まちでは「プラスチック」へ。',
        sh: 'プラスチックの おもちゃは「リサイクルできる もの」。'
      }
    },
    {
      id: 'battery', name: 'かんでんち（ふつうの でんち）', icon: 'battery',
      answers: { jp: 'varies', sh: 'dry', kr: 'special' },
      why: {
        sh: 'いまの ふつうの かんでんちは、体に わるい「すいぎん」を 使って いないので、{上海|シャンハイ}では「かわいた ごみ」！',
        kr: 'でんちは まちに ある「でんちの {回収|かいしゅう}ボックス」へ。中の 金ぞくを リサイクル するよ。'
      }
    },
    {
      id: 'rechargeable', name: 'じゅうでんち（くりかえし 使える でんち）', icon: 'rechargeable',
      answers: { jp: 'varies', sh: 'hazardous', kr: 'special' },
      why: {
        sh: 'じゅうでんちは「{有害|ゆうがい}な ごみ」。ふつうの かんでんちとは ちがう 箱だよ！',
        kr: '{専用|せんよう}ボックスへ。ほかの ごみに まぜると、つぶれて 火が 出る ことが あるよ。'
      }
    },
    {
      id: 'medicine', name: '古い くすり', icon: 'medicine',
      answers: { sh: 'hazardous', kr: 'special' },
      why: {
        sh: 'のこった くすりは「{有害|ゆうがい}な ごみ」。はこや ふくろに 入れた まま 出すよ。',
        kr: 'くすりは 薬局 などに ある {専用|せんよう}ボックスへ。川や 土を よごさない ためだよ。'
      }
    },
    {
      id: 'fluorescent', name: 'けいこうとう', icon: 'fluorescent',
      answers: { jp: 'varies', sh: 'hazardous', kr: 'special' },
      why: {
        sh: 'われやすいので、つつんで そっと 入れるよ。',
        kr: 'けいこうとうには 体に わるい「すいぎん」が 入って いるので、{専用|せんよう}ボックスへ。'
      }
    },
    {
      id: 'dish', name: 'われた お茶わん', icon: 'dish',
      answers: { jp: 'moenai', sh: 'dry' },
      why: {
        jp: 'せとものは もえないし、リサイクルも むずかしいので もえないごみ。紙に つつんで 出そう。',
        sh: 'せとものは「かわいた ごみ」だよ。'
      }
    },
    {
      id: 'brokenglass', name: 'われた ガラスの コップ', icon: 'brokenglass',
      answers: { jp: 'moenai', sh: 'recyclable' },
      why: {
        jp: 'コップの ガラスは びんとは ちがう ガラスなので、もえないごみ。つつんで 出そう。',
        sh: '{上海|シャンハイ}では われた ガラスも「リサイクルできる もの」。けがを しないように つつんで 出すよ。'
      }
    },
    {
      id: 'pot', name: '古い なべ（金ぞく）', icon: 'pot',
      answers: { jp: 'moenai', sh: 'recyclable', kr: 'recycle' },
      why: {
        jp: '小さな 金ぞくの ものは もえないごみ。',
        sh: '金ぞくは「リサイクルできる もの」。',
        kr: 'なべは 金ぞくとして リサイクル するよ。'
      }
    },
    {
      id: 'jar', name: 'ジャムの びん', icon: 'jar',
      answers: { jp: 'shigen', sh: 'recyclable', kr: 'recycle' },
      why: {
        jp: '中を あらって {資源|しげん}ごみへ。',
        sh: 'ガラスの びんは そっと 入れよう。',
        kr: '中を からに して リサイクル。'
      }
    },
    {
      id: 'clothes', name: '古い 服', icon: 'clothes',
      answers: { sh: 'recyclable' },
      why: {
        sh: '服や ぬいぐるみも「リサイクルできる もの」！'
      }
    },
    {
      id: 'umbrella', name: 'こわれた かさ', icon: 'umbrella',
      answers: { sh: 'dry' },
      why: {
        sh: 'いろいろな ざいりょうが まざった ものは「かわいた ごみ」。'
      }
    }
  ],

  /* ================================================================
   * まとめ画面
   * ================================================================ */
  summary: {
    title: '3つの 国を くらべよう',
    types: [
      {
        title: '国が きめる', who: '中国・{韓国|かんこく}', color: '#2f6fdf',
        text: '国が もとの ルールを きめるよ。だから 国の 中なら、だいたい 同じ 分けかたで 出せるんだ。'
      },
      {
        title: 'まちが きめる', who: '日本', color: '#e8603c',
        text: '{市町村|しちょうそん}が ルールを きめるよ。まちの しせつに あわせられるけど、ひっこすと ルールが かわるんだ。'
      }
    ],
    compareTitle: '同じ ごみ、どこに 入れる？',
    compareItems: ['egg', 'bigbone', 'tea', 'banana', 'tissue', 'battery', 'pet'],
    think: [
      '同じ ごみなのに、国に よって 入れる 箱が ちがった ものは どれかな？',
      '「国が きめる」と「まちが きめる」、それぞれの いい ところと こまる ところは なにかな？',
      'あなたの まちの ルールは どう なって いるかな？ おうちの 人と しらべて みよう！'
    ]
  },

  /* ================================================================
   * 絵（SVG）
   *   viewBox は 0 0 100 100。線（ふち）の 色と 太さは game.js が つけます。
   *   p_ で はじまる ものは ごみ箱の マーク（白で かく）。
   *   l_ で はじまる ものは 国の たてもの。
   * ================================================================ */
  icons: {
    /* ---- ごみ ---- */
    banana:
      '<rect x="46" y="12" width="8" height="18" rx="3" fill="#8b5a2b"/>' +
      '<path d="M44 30 Q30 38 21 62 Q18 75 28 76 Q35 60 47 44 Z" fill="#ffe27a"/>' +
      '<path d="M56 30 Q70 38 79 62 Q82 75 72 76 Q65 60 53 44 Z" fill="#ffe27a"/>' +
      '<path d="M42 30 Q50 25 58 30 L60 74 Q50 88 40 74 Z" fill="#ffd34d"/>' +
      '<circle cx="50" cy="58" r="2.5" fill="#8b5a2b" stroke="none"/>' +
      '<circle cx="30" cy="62" r="2" fill="#8b5a2b" stroke="none"/>' +
      '<circle cx="69" cy="54" r="2" fill="#8b5a2b" stroke="none"/>',
    egg:
      '<path d="M22 60 L30 54 L37 61 L44 53 L51 61 L58 53 L65 61 L72 54 L78 60 Q80 87 50 89 Q20 87 22 60 Z" fill="#fff4e0"/>' +
      '<g transform="rotate(-18 50 30)"><path d="M28 44 Q28 13 50 11 Q72 13 72 44 L65 38 L58 45 L51 38 L44 45 L37 38 Z" fill="#fff4e0"/></g>',
    bigbone:
      '<g transform="rotate(-30 50 50)"><path d="M34 45 A10 10 0 1 0 22 50 A10 10 0 1 0 34 55 L66 55 A10 10 0 1 0 78 50 A10 10 0 1 0 66 45 Z" fill="#f8f1dc"/></g>',
    fishbone:
      '<path d="M12 50 L32 33 Q37 50 32 67 Z" fill="#eef2f3"/>' +
      '<path d="M32 50 L78 50" fill="none"/>' +
      '<path d="M42 37 Q46 50 42 63 M52 35 Q56 50 52 65 M62 37 Q66 50 62 63" fill="none"/>' +
      '<path d="M78 50 L91 35 Q86 50 91 65 Z" fill="#eef2f3"/>' +
      '<circle cx="23" cy="47" r="2.5" fill="#3a3a3a" stroke="none"/>',
    chickenbone:
      '<g transform="rotate(35 50 50)"><path d="M42 30 A9 9 0 1 1 58 30 L56 74 A8 8 0 1 1 44 74 Z" fill="#fbf3e4"/>' +
      '<circle cx="45" cy="42" r="4" fill="#c98a4b" stroke="none"/>' +
      '<circle cx="54" cy="55" r="3" fill="#c98a4b" stroke="none"/></g>',
    shell:
      '<path d="M50 82 L20 54 Q16 28 50 20 Q84 28 80 54 Z" fill="#ffd2bd"/>' +
      '<path d="M50 82 L30 33 M50 82 L42 23 M50 82 L58 23 M50 82 L70 33" fill="none" stroke-width="2.5"/>' +
      '<path d="M40 80 L60 80 L56 90 L44 90 Z" fill="#f4a988"/>',
    peachpit:
      '<path d="M50 14 Q77 33 75 58 Q71 85 50 87 Q29 85 25 58 Q23 33 50 14 Z" fill="#b9774b"/>' +
      '<path d="M50 20 Q45 50 50 81" fill="none" stroke-width="2.5"/>' +
      '<path d="M35 40 Q40 46 35 52 M37 62 Q43 66 38 72 M65 40 Q60 46 65 52 M63 62 Q57 66 62 72" fill="none" stroke-width="2.5"/>',
    tea:
      '<ellipse cx="50" cy="68" rx="37" ry="13" fill="#e7eef2"/>' +
      '<path d="M22 66 Q26 42 50 40 Q74 42 78 66 Q50 74 22 66 Z" fill="#6a9a44"/>' +
      '<path d="M33 56 q6 -6 12 0 M52 50 q6 -6 12 0 M45 62 q6 -5 12 0" fill="none" stroke="#3f6a26" stroke-width="2.5"/>',
    tissue:
      '<path d="M28 34 L42 24 L54 31 L68 26 L77 42 L72 56 L79 70 L63 79 L50 72 L36 80 L22 67 L28 52 L22 44 Z" fill="#ffffff"/>' +
      '<path d="M36 40 Q44 46 40 56 M58 36 Q56 46 66 50 M46 64 Q56 64 60 72" fill="none" stroke-width="2"/>',
    diaper:
      '<path d="M18 30 L82 30 L78 50 Q64 56 60 80 L40 80 Q36 56 22 50 Z" fill="#f4f8ff"/>' +
      '<path d="M18 30 L82 30 L80 39 L20 39 Z" fill="#a9cdf5"/>' +
      '<rect x="10" y="34" width="13" height="9" rx="3" fill="#ffd36b"/>' +
      '<rect x="77" y="34" width="13" height="9" rx="3" fill="#ffd36b"/>' +
      '<circle cx="50" cy="56" r="5" fill="#ffc2d1" stroke="none"/>',
    leftover:
      '<path d="M24 50 Q30 33 50 33 Q70 33 76 50 Z" fill="#ffffff"/>' +
      '<path d="M18 50 L82 50 Q80 80 50 82 Q20 80 18 50 Z" fill="#d35454"/>' +
      '<path d="M40 82 L60 82 L58 89 L42 89 Z" fill="#b84343"/>' +
      '<circle cx="42" cy="44" r="3.5" fill="#6ab04c" stroke="none"/>' +
      '<circle cx="57" cy="41" r="3.5" fill="#f0932b" stroke="none"/>' +
      '<path d="M60 30 L88 14 M64 35 L92 19" fill="none" stroke="#8b5a2b" stroke-width="3.5"/>',
    apple:
      '<path d="M34 24 Q50 32 66 24 Q58 38 60 52 Q58 66 66 80 Q50 72 34 80 Q42 66 40 52 Q42 38 34 24 Z" fill="#fff5d6"/>' +
      '<path d="M32 24 Q50 32 68 24 Q62 14 50 16 Q38 14 32 24 Z" fill="#e74c3c"/>' +
      '<path d="M32 80 Q50 72 68 80 Q62 90 50 88 Q38 90 32 80 Z" fill="#e74c3c"/>' +
      '<path d="M50 16 Q50 8 56 4" fill="none" stroke="#8b5a2b" stroke-width="3.5"/>' +
      '<ellipse cx="47" cy="49" rx="2.5" ry="4" fill="#5d4037" stroke="none"/>' +
      '<ellipse cx="54" cy="55" rx="2.5" ry="4" fill="#5d4037" stroke="none"/>',
    watermelon:
      '<path d="M10 38 Q50 102 90 38 Z" fill="#2ecc71"/>' +
      '<path d="M18 39.5 Q50 91 82 39.5 Z" fill="#eefbe2" stroke="none"/>' +
      '<path d="M30 40 Q50 72 70 40 Z" fill="#ff7675" stroke="none"/>' +
      '<path d="M10 38 L90 38" fill="none"/>' +
      '<ellipse cx="44" cy="47" rx="1.8" ry="3" fill="#3a3a3a" stroke="none"/>' +
      '<ellipse cx="56" cy="50" rx="1.8" ry="3" fill="#3a3a3a" stroke="none"/>',
    cornhusk:
      '<path d="M50 88 Q30 70 24 36 Q22 22 30 14 Q36 40 50 88 Z" fill="#a5d36b"/>' +
      '<path d="M50 88 Q70 70 76 36 Q78 22 70 14 Q64 40 50 88 Z" fill="#a5d36b"/>' +
      '<path d="M50 88 Q42 60 46 20 Q50 12 54 20 Q58 60 50 88 Z" fill="#8bc34a"/>' +
      '<path d="M46 20 Q40 10 34 8 M50 18 Q50 8 52 4 M54 20 Q60 10 66 8" fill="none" stroke="#b5651d" stroke-width="2.5"/>',
    corncob:
      '<g transform="rotate(-35 50 50)"><rect x="36" y="10" width="28" height="80" rx="14" fill="#f3e2a2"/>' +
      '<g fill="#c9a94e" stroke="none">' +
      '<ellipse cx="43" cy="22" rx="2.6" ry="3.4"/><ellipse cx="50" cy="20" rx="2.6" ry="3.4"/><ellipse cx="57" cy="22" rx="2.6" ry="3.4"/>' +
      '<ellipse cx="43" cy="32" rx="2.6" ry="3.4"/><ellipse cx="50" cy="30" rx="2.6" ry="3.4"/><ellipse cx="57" cy="32" rx="2.6" ry="3.4"/>' +
      '<ellipse cx="43" cy="42" rx="2.6" ry="3.4"/><ellipse cx="50" cy="40" rx="2.6" ry="3.4"/><ellipse cx="57" cy="42" rx="2.6" ry="3.4"/>' +
      '<ellipse cx="43" cy="52" rx="2.6" ry="3.4"/><ellipse cx="50" cy="50" rx="2.6" ry="3.4"/><ellipse cx="57" cy="52" rx="2.6" ry="3.4"/>' +
      '<ellipse cx="43" cy="62" rx="2.6" ry="3.4"/><ellipse cx="50" cy="60" rx="2.6" ry="3.4"/><ellipse cx="57" cy="62" rx="2.6" ry="3.4"/>' +
      '<ellipse cx="43" cy="72" rx="2.6" ry="3.4"/><ellipse cx="50" cy="70" rx="2.6" ry="3.4"/><ellipse cx="57" cy="72" rx="2.6" ry="3.4"/>' +
      '<ellipse cx="50" cy="80" rx="2.6" ry="3.4"/></g>' +
      '<rect x="44" y="86" width="12" height="8" rx="3" fill="#a5d36b"/></g>',
    pet:
      '<rect x="42" y="8" width="16" height="10" rx="2" fill="#2f80ed"/>' +
      '<path d="M44 18 L56 18 L56 26 Q68 32 68 44 L68 84 Q68 90 62 90 L38 90 Q32 90 32 84 L32 44 Q32 32 44 26 Z" fill="#e3f4ff"/>' +
      '<rect x="32" y="50" width="36" height="16" fill="#69b7f0"/>' +
      '<path d="M40 72 L40 83" fill="none" stroke="#9fd0f5" stroke-width="4"/>',
    can:
      '<path d="M30 22 L70 22 L70 80 Q70 87 50 87 Q30 87 30 80 Z" fill="#e74c3c"/>' +
      '<ellipse cx="50" cy="22" rx="20" ry="6" fill="#d5dde2"/>' +
      '<path d="M30 45 Q50 53 70 45 L70 58 Q50 66 30 58 Z" fill="#ffffff" stroke-width="2.5"/>' +
      '<path d="M45 20 L56 20" fill="none"/>',
    newspaper:
      '<g transform="rotate(-6 50 50)"><rect x="18" y="20" width="64" height="60" rx="3" fill="#f3efe4"/>' +
      '<rect x="24" y="26" width="52" height="9" fill="#3a3a3a" stroke="none"/>' +
      '<rect x="24" y="41" width="22" height="17" fill="#c8d6e5" stroke-width="2"/>' +
      '<path d="M52 43 H76 M52 50 H76 M52 57 H76 M24 65 H76 M24 72 H66" fill="none" stroke="#8a8a8a" stroke-width="2.5"/></g>',
    milk:
      '<path d="M30 36 L70 36 L70 87 L30 87 Z" fill="#ffffff"/>' +
      '<path d="M30 36 L40 20 L60 20 L70 36 Z" fill="#eef3f8"/>' +
      '<rect x="38" y="13" width="24" height="7" fill="#ffffff"/>' +
      '<rect x="30" y="50" width="40" height="22" fill="#5aa9e6"/>' +
      '<path d="M50 52 Q58 61 56 65 Q54 70 50 70 Q46 70 44 65 Q42 61 50 52 Z" fill="#ffffff" stroke-width="2"/>',
    snack:
      '<path d="M24 22 L30 16 L36 22 L42 16 L48 22 L54 16 L60 22 L66 16 L72 22 L76 22 Q82 52 76 82 L70 88 L64 82 L58 88 L52 82 L46 88 L40 82 L34 88 L28 82 L24 82 Q18 52 24 22 Z" fill="#ff9f43"/>' +
      '<circle cx="50" cy="52" r="14" fill="#ffe08a"/>' +
      '<path d="M43 50 q3 -3 6 0 M50 57 q3 -3 6 0" fill="none" stroke-width="2"/>',
    cup:
      '<path d="M28 36 L72 36 L64 84 L36 84 Z" fill="#fffbea"/>' +
      '<rect x="22" y="29" width="56" height="9" rx="4" fill="#ffffff"/>' +
      '<path d="M33 54 L67 54" fill="none" stroke="#e0c068" stroke-width="2.5"/>',
    toy:
      '<rect x="22" y="54" width="56" height="28" rx="3" fill="#e74c3c"/>' +
      '<rect x="27" y="46" width="11" height="8" rx="2" fill="#e74c3c"/>' +
      '<rect x="34" y="30" width="38" height="22" rx="3" fill="#3498db"/>' +
      '<rect x="39" y="22" width="11" height="8" rx="2" fill="#3498db"/>' +
      '<rect x="56" y="22" width="11" height="8" rx="2" fill="#3498db"/>',
    battery:
      '<rect x="44" y="11" width="12" height="9" rx="2" fill="#b2bec3"/>' +
      '<rect x="32" y="20" width="36" height="68" rx="6" fill="#2d3436"/>' +
      '<path d="M32 26 Q32 20 38 20 L62 20 Q68 20 68 26 L68 40 L32 40 Z" fill="#f0b429"/>' +
      '<path d="M50 25 V35 M45 30 H55" fill="none" stroke="#2d3436" stroke-width="3"/>' +
      '<path d="M44 68 H56" fill="none" stroke="#ffffff" stroke-width="3"/>',
    rechargeable:
      '<rect x="44" y="11" width="12" height="9" rx="2" fill="#b2bec3"/>' +
      '<rect x="32" y="20" width="36" height="68" rx="6" fill="#27ae60"/>' +
      '<path d="M54 30 L40 56 L50 56 L46 78 L62 48 L52 48 Z" fill="#ffe066" stroke-width="2.5"/>',
    medicine:
      '<rect x="16" y="26" width="68" height="48" rx="8" fill="#dfe6e9"/>' +
      '<g fill="#ff7675"><ellipse cx="33" cy="42" rx="7" ry="5"/><ellipse cx="50" cy="42" rx="7" ry="5"/>' +
      '<ellipse cx="67" cy="42" rx="7" ry="5"/><ellipse cx="33" cy="60" rx="7" ry="5"/>' +
      '<ellipse cx="50" cy="60" rx="7" ry="5" fill="#ffffff"/><ellipse cx="67" cy="60" rx="7" ry="5" fill="#ffffff"/></g>',
    fluorescent:
      '<g transform="rotate(-30 50 50)"><rect x="14" y="44" width="72" height="12" rx="6" fill="#fdfdfd"/>' +
      '<rect x="8" y="42" width="10" height="16" rx="2" fill="#b2bec3"/>' +
      '<rect x="82" y="42" width="10" height="16" rx="2" fill="#b2bec3"/>' +
      '<path d="M3 46 H8 M3 54 H8 M92 46 H97 M92 54 H97" fill="none" stroke-width="2.5"/></g>',
    dish:
      '<path d="M14 44 L46 44 L42 54 L50 62 L44 81 Q18 79 14 44 Z" fill="#f4e7cf"/>' +
      '<path d="M17 53 L41 53" fill="none" stroke="#4a7fc1" stroke-width="3"/>' +
      '<g transform="translate(9 3) rotate(12 66 60)"><path d="M46 44 L86 44 Q82 79 44 81 L50 62 L42 54 Z" fill="#f4e7cf"/>' +
      '<path d="M45 53 L83 53" fill="none" stroke="#4a7fc1" stroke-width="3"/></g>',
    brokenglass:
      '<path d="M28 30 L36 22 L42 32 L50 20 L56 30 L64 22 L72 30 L64 84 L36 84 Z" fill="#dff6fb"/>' +
      '<path d="M46 44 L52 54 L46 62 L52 72" fill="none" stroke-width="2"/>' +
      '<path d="M76 76 L88 70 L85 86 Z" fill="#dff6fb"/>' +
      '<path d="M12 82 L21 74 L24 88 Z" fill="#dff6fb"/>',
    pot:
      '<rect x="14" y="36" width="72" height="9" rx="4" fill="#dfe6e9"/>' +
      '<path d="M20 45 L80 45 L76 78 Q74 84 68 84 L32 84 Q26 84 24 78 Z" fill="#b2bec3"/>' +
      '<path d="M14 52 H5 M86 52 H95" fill="none" stroke-width="6"/>' +
      '<path d="M31 55 L31 73" fill="none" stroke="#ffffff" stroke-width="3"/>',
    jar:
      '<rect x="32" y="15" width="36" height="13" rx="3" fill="#e17055"/>' +
      '<path d="M30 28 L70 28 L72 38 L72 82 Q72 88 66 88 L34 88 Q28 88 28 82 L28 38 Z" fill="#e8f7f4"/>' +
      '<rect x="34" y="50" width="32" height="20" rx="3" fill="#ffeaa7"/>' +
      '<circle cx="50" cy="60" r="5" fill="#e17055" stroke="none"/>',
    clothes:
      '<path d="M36 20 L44 24 Q50 32 56 24 L64 20 L84 32 L76 46 L68 41 L68 84 L32 84 L32 41 L24 46 L16 32 Z" fill="#74b9ff"/>' +
      '<path d="M42 60 h16 v12 h-16 z" fill="#ffeaa7" stroke-width="2"/>',
    umbrella:
      '<path d="M50 50 V82 Q50 90 43 90 Q37 90 37 84" fill="none" stroke-width="4"/>' +
      '<path d="M12 52 Q50 4 88 52 Q82 45 75 52 Q69 45 62 52 Q56 45 50 52 Q44 45 38 52 Q31 45 25 52 Q19 45 12 52 Z" fill="#a29bfe"/>' +
      '<path d="M50 14 Q40 30 38 50 M50 14 Q60 30 62 50" fill="none" stroke-width="2"/>' +
      '<path d="M50 14 V8" fill="none" stroke-width="4"/>',
    trashbag:
      '<path d="M30 34 Q20 40 18 62 Q17 86 50 88 Q83 86 82 62 Q80 40 70 34 Z" fill="#9aa5b1"/>' +
      '<path d="M38 34 L32 14 L50 25 L68 14 L62 34 Z" fill="#9aa5b1"/>' +
      '<path d="M40 34 H60" fill="none" stroke-width="3"/>' +
      '<path d="M30 52 L34 70 M70 52 L66 70" fill="none" stroke="#7d8894" stroke-width="2.5"/>',

    /* 見つからない ときの 絵 */
    _missing:
      '<circle cx="50" cy="50" r="36" fill="#f1f2f6"/>' +
      '<path d="M40 40 Q40 28 50 28 Q61 28 61 39 Q61 47 52 51 L52 58" fill="none" stroke-width="5"/>' +
      '<circle cx="52" cy="70" r="4" fill="#3a3a3a" stroke="none"/>',

    /* ---- ごみ箱の マーク（白。currentColor = ごみ箱の 色） ---- */
    p_flame:
      '<path d="M50 8 Q76 36 72 60 Q68 86 50 90 Q32 86 28 62 Q26 44 44 30 Q42 48 53 50 Q60 30 50 8 Z"/>',
    p_noburn:
      '<path d="M22 28 L78 28 L71 86 L29 86 Z"/>' +
      '<path d="M50 28 L43 46 L55 60 L46 86" fill="none" stroke="currentColor" stroke-width="7" stroke-linejoin="round"/>',
    p_pla:
      '<rect x="10" y="22" width="80" height="56" rx="14" fill="none" stroke="#ffffff" stroke-width="8"/>' +
      '<text x="50" y="62" text-anchor="middle" font-size="32" font-weight="900" fill="#ffffff">プラ</text>',
    p_recycle:
      '<path d="M22 50 A28 28 0 0 1 68 28" fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M60 12 L84 30 L56 40 Z"/>' +
      '<path d="M78 50 A28 28 0 0 1 32 72" fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M40 88 L16 70 L44 60 Z"/>',
    p_hazard:
      '<path d="M50 10 L92 86 L8 86 Z" stroke="#ffffff" stroke-width="6" stroke-linejoin="round"/>' +
      '<rect x="44.5" y="36" width="11" height="28" rx="4" fill="currentColor"/>' +
      '<circle cx="50" cy="74" r="6" fill="currentColor"/>',
    p_drop:
      '<path d="M50 8 Q80 46 78 62 Q76 90 50 90 Q24 90 22 62 Q20 46 50 8 Z"/>',
    p_dry:
      '<path d="M30 36 Q18 44 16 64 Q15 90 50 90 Q85 90 84 64 Q82 44 70 36 Z"/>' +
      '<path d="M38 36 L32 14 L50 26 L68 14 L62 36 Z"/>' +
      '<path d="M40 36 H60" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
    p_bag:
      '<path d="M32 34 Q20 40 18 62 Q17 88 50 90 Q83 88 82 62 Q80 40 68 34 Z"/>' +
      '<path d="M38 34 Q36 14 50 14 Q64 14 62 34" fill="none" stroke="#ffffff" stroke-width="8"/>' +
      '<text x="50" y="76" text-anchor="middle" font-size="30" font-weight="900" fill="currentColor">₩</text>',
    p_food:
      '<path d="M12 48 L88 48 Q86 84 50 86 Q14 84 12 48 Z"/>' +
      '<path d="M34 40 Q28 31 34 22 M50 40 Q44 29 50 18 M66 40 Q60 31 66 22" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>',
    p_battery:
      '<rect x="12" y="28" width="66" height="46" rx="8"/>' +
      '<rect x="78" y="42" width="10" height="18" rx="3"/>' +
      '<path d="M50 34 L34 54 L46 54 L40 70 L60 48 L48 48 L54 34 Z" fill="currentColor"/>',

    /* ---- 国の たてもの ---- */
    l_fuji:
      '<circle cx="78" cy="24" r="10" fill="#e74c3c" stroke="none"/>' +
      '<path d="M6 84 L38 34 Q50 22 62 34 L94 84 Z" fill="#5b7fbd"/>' +
      '<path d="M31 45 L38 34 Q50 22 62 34 L69 45 L61 50 L55 43 L49 50 L43 43 L37 50 Z" fill="#ffffff"/>',
    l_pearl:
      '<path d="M50 72 L34 91 M50 72 L66 91 M50 72 L50 91" fill="none" stroke-width="3"/>' +
      '<rect x="47" y="10" width="6" height="66" fill="#b2bec3"/>' +
      '<circle cx="50" cy="64" r="13" fill="#e84393"/>' +
      '<circle cx="50" cy="36" r="8" fill="#e84393"/>' +
      '<circle cx="50" cy="18" r="3.5" fill="#e84393"/>' +
      '<path d="M50 10 V2" fill="none" stroke-width="2.5"/>',
    l_tower:
      '<path d="M4 92 Q50 60 96 92 Z" fill="#6ab04c"/>' +
      '<path d="M46 72 L54 72 L52.5 36 L47.5 36 Z" fill="#dfe6e9"/>' +
      '<rect x="38" y="26" width="24" height="11" rx="4" fill="#b2bec3"/>' +
      '<rect x="42" y="20" width="16" height="7" rx="2" fill="#dfe6e9"/>' +
      '<path d="M50 20 V4" fill="none" stroke-width="3"/>'
  }
};
