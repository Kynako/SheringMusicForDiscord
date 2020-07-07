// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: magic;
/*
 SM4D #2.1.1
*/
const json = JSON.parse(args.plainTexts[0])
// QuickLook.present(json, true)
/* --- SM4D's Setting JSON Model ---
{
  "THIS_ver": "2.1.0",
  "THIS_name": "SM4D(JS Edition)",
  "API_lib": "Musica.js",
  "DATA_lib": "DiscordData Beta1.1",
  "THIS_icon": "https://discordapp.com/channels/603866437785747459/631624738174926898/728822312115109908"
}
*/ 
const S = json['setting'];
/* --- DiscordData's JSON Model ---
{  
  "U": [
    {
      "id": <str:18digits>,
      "bot": <boolean>,
      "username": <str>,
      "discriminator": <str:4digits>,
      "avatar": <str:hash>,
      "lastMessageChannelID": <str:18digits>,
      "flags": <int>,
      "createdTimestamp": <int>
      "defaultAvatarURL": <str:mediaUrl>
      "tag": <str:username#descriminator>
      "avatarURL": <str:mediaUrl>
      "displayAvatarURL": <str:mediaUrl>
    },
    ...
  ],
  "W": [
    {
      "avatar" : <str:hash | null>,
      "id" : <str:18digits>,
      "channel_id" : <str:18digits>,
      "guild_id" : <str:18digits>,
      "type" : <int>,
      "token" : <str>
      "name" : <str>
    },
    ...
  ]
}
*/

const U = json.data.U[0];
const Ws = json.data.W;

const user_id = '<@'+U.id+'>';
//api:variable -----
const apiData = json['api'];
  let Rslt = apiData.results[0];
  var wT = Rslt.wrapperType;

for (i = 0; i < Ws.length; i++) {
  
  if (wT == 'track' || wT == 'collection') {
    var emb_url = Rslt[wT+'ViewUrl'];

    let awUrl100 = Rslt.artworkUrl100;
    var emb_thumb_url = Rslt['artworkUrl100'].replace(/100x100bb/,'512x512bb');

    var emb_sl_title = 'SongLinkで検索';
    //EmbedsSonglinkUrl
    var emb_sl_url = 'https://song.link/' + Rslt[wT+'ViewUrl']
  
  } else if (wT === 'artist') {

    var emb_url = Rslt.artistLinkUrl;

    //EmbedsThumbnailUrl
    var emb_thumb_url = null;

    //EmbedsSonglinkTitle
    var emb_sl_title = '~~SongLinkで検索~~'; 
  
    //EmbedsSonglinkUrl
    var emb_sl_url = 'AAAAA';

  } else {
    let errorMessage = 'wT != track OR collection OR artist';
    ErrorHundle(errorMessage);
  };

  //body:EmbedsDescription -----
  if (wT === 'track') {
    var emb_description = Rslt.collectionName+'\n'+'[試聴リンク]('+Rslt.previewUrl+')';
  } else if (wT === 'collection') {
    var emb_description = '-Album-\n~~[試聴リンク]~~';
  } else if (wT === 'artist') {
    var emb_descriptoon = '-Artist-\n~~[試聴リンク]~~';
  } else {
    let errorMessage = 'wT != track OR collection OR artist'
    ErrorHundle(errorMessage);
  };


  //body:composeBody -----
  const Body = {
    "username": S.THIS_name +' '+ S.THIS_ver,
    "avatar_url": S.THIS_icon,
    "content": "**"+user_id+"さんのおすすめ**",
    "embeds": [
      {
        "author": {
          "name": U.username,
          "icon_url": ImageLink(U.id, U.avatar)
        },
        "color": 16725855,
        "title": "__"+Rslt[wT+'Name']+'__',
        "url": emb_url,
        "description": emb_description,
        "thumbnail": {
          "url": emb_thumb_url,
        },
        "footer": {
          "text": "wT:"+wT+" | wTId:"+Rslt[wT+'Id']
        }
      },
      {
        "author": {
          "name": "Powered by Odesli"
        },
        "color": 16777215,
        "title": emb_sl_title,
        "url": emb_sl_url
      
      }
    ]
  };
// QuickLook.present(Body, true)

  //body:httpPOSTRequest -----

  var webhook = CreateWebhook(Ws[i].id, Ws[i].token);
  let DiscordReq = new Request(webhook);
      DiscordReq.method = 'POST';
      DiscordReq.headers = {
        "Content-Type": "application\/json"
      };
      DiscordReq.body = JSON.stringify(Body);
  let DiscordResult = await DiscordReq.loadString();
//   QuickLook.present(DiscordResult, false)
  let DiscordResponse = await DiscordReq.response;
//   QuickLook.present(DiscordResponse, false)
};


//Script.setShortcutOutput(DiscordResult);
Script.complete();


//===============================
//FUNCTIONS
// ErrorHundle(errorMessage:string)

      
function ErrorHundle (errorMessage) {
  console.error('ErrorHundle: '+message);
  Script.setShortcutOutput('ErrorHundle: '+message);
  Script.complete();
};

function CreateWebhook (id, token) {
  return 'https://discordapp.com/api/webhooks/'+id+'/'+token;
};

function ImageLink (id, avatar) {
  if (true) {
    return 'https://cdn.discordapp.com/avatars/'+id+'/'+avatar+'.jpeg';
  } else {
    return 'https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/e0/cd/19/e0cd19ec-f11f-b768-08a2-b7dfc0403aa1/source/512x512bb.png';
  };
};