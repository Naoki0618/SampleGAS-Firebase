
// CloudFirestoreの認証
var dateArray = firestoreIni();
var firestore = FirestoreApp.getFirestore(dateArray.email, dateArray.key, dateArray.projectId);

function firestoreIni() {
  var dateArray = {
    'email': "firebase-adminsdk-9epof@workshop-23257.iam.gserviceaccount.com",
    'key': "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCxVRCUggkODQfR\nXd2SDf3EoyCyC2cpiaiUAp6SJkADZBG+bX6NOC703j4zLox44HStRaJ3z25uFRXV\nej2ba3C6ZK2ug0O0wJ2KyljmytQHH7B2unKVQPQ92ncE9ZJihm9aLzEDvp+5QbKU\n7RHOjSJx3SB1Thz9E5G1l/L7C5yd+3BWpeIx696Id8kAwp3Gq51wZ2Zo8J5BLCeu\nCO7A/vFbqXY8dzQuYpOZV14SN+NNqvL0de3S0LduUBlFUzkqDoEkUaXWZftsKnhL\nG638tc9C/CK3ojpHNdFT7m+TPwERFLOWgln4DZ1+azdyC9MPS7zWZaEduHwDaTCE\nCdSXFUCJAgMBAAECggEAFYLT+23QNyD/xicQpAFYO5iNtGdTdOuW1FiCf4hOCtNC\nX0MVP0B12ryUVz1R6y5QHP411HqIQuiCIOaej0o/zw58Lo+MAKK+YZoE4X8wa+pN\nS8O3d1E9J30nI6X94z97Rbl0hMekhLKaXPwqhS+j4mPQZoZqmAz+B4UWg5s/nP6x\n6tpnAj98O9QbIfe7Aw1KYhIYn8IdvqCv2xP5irlq3UXWFke7Azh8VteGJYw6Gpfk\n8yoisI7ZtizORJMFSNLxJRAEFiIBmObYduYalD+Upyb06tb77Ry4gwb8Fp6lsGAk\n4fr7qHedK82hjJUtVPXw14CaoxQ1RBtXo46npLC1UQKBgQDW4oPDpl4SYj3IKKWk\nKFjpKs8Z/M/uwxLju5CSIdpM+oa1hVDlO7LsQt8JqPnmJZUt/mRFvmjb8LuctaQk\n54lau1a30NYrCmbzBgV379iu4LyhfRX8jUkWzzJygaB8V04HPzj03aukRJsBkqhO\nWAUcKf456QjronVCPoVa/v7m0QKBgQDTQybzM2PCNoisZ57n4+zsr440fjvCUZgS\njZ2cge/8P3Zcc5SCbqBz1zN0XXG7dGUtczPIddzwNzDAYc2ed34mtCqIAHJewcRg\n1Gkce5eqnEOZqQkFvpK5hTKE/0XRGn/bc8Db6Lb9YvUbOQkCk3ufOvBQAKghX4U5\nqcOh3QUcOQKBgEGB/l9HuYfrMSBy28RGlIxIg6hNfOoxx/Fq/bC+5zjuauCtirLH\nV01VOX9NZxl1PZwu4EyutnLOWbN1YFvrxeDGGbKh1Jh8bFQL8uDUWn89fePRKUG7\npJtygNONluoxB1WIPYnQhgHm9EYvemWfybcDSkBHPXPwK8UNIERUVkrxAoGAMSV4\nFC+qT238UY8ximSdo1obzN5o7IWqyPYk6lnYCGiDEnLY45b0wL4ZfEKYyLEFMJOS\nQloY8dEFCFw4R1so/7v+APGJqb2N/7CqWzPtToVXvJF0Rd/Vpk70N7hi94ggol7F\nSONUXpH8zz5veCfzJFHDwfjFJC5igc2aczdFjxECgYBM82KYllJXyZs5GFA1XfvK\nf6PHeu/yRGszdYs4KQsX8LjQqZB5ldomNKyuA26dIJ6ZaGDtLEtEeDNjfhKVn+pc\nGQ7eWNPNZOo6Kc8kIctR7Tay6CBse7LzGjhCtIZhjrDFWfVp42mdgaZQaOFuCYk8\nzolhBVVKGxvALE7AR31tWw==\n-----END PRIVATE KEY-----\n",
    'projectId': 'workshop-23257'
  }
  return dateArray;
}

// ドキュメント追加
function createRequest(li) {

  var index = getIndex() + 1;
  var today = new Date();

  var project_id = ('000000' + String(index)).slice(-6)

  const data = {
    "プロジェクトID": index,
    "登録日": Utilities.formatDate(today, 'JST', 'yyyy/MM/dd'),
    "開催者名": li['tanto'],
    "メールアドレス": li['email'],
    "ワークショップ名": li['nWork'],
    "講義内容": li['contents'],
    "開催日": li['hDay'],
    "開始時刻": li['sTime'],
    "終了時刻": li['fTime'],
    "最少人数": Number(li['count']),
    "参加数": 0,
    "ステータス": "未",
  }
  firestore.createDocument("WorkShop/" + project_id, data,);
  updateIndex(index)
}

// ドキュメントの通し番号を取得
function getIndex() {
  // CloudFirestoreからデータを読み込む
  const doc = firestore.getDocument("Setting/0fbG5SRrbuepDkhYxuYn");
  console.log(doc.fields['Index']['integerValue']);

  return Number(doc.fields['Index']['integerValue'])
}

// ドキュメントの通し番号をインクリメント
function updateIndex(index) {

  const data = {
    "Index": index,
  }
  firestore.updateDocument("Setting/0fbG5SRrbuepDkhYxuYn", data, true);
};

function setDoc(key, count){
  data = {
    "参加数":Number(count)
  };
  firestore.updateDocument("WorkShop/" + String(key), data, true);
};

// ドキュメントを1件取得
function getDoc(key) {
  // CloudFirestoreからデータを読み込む
  const doc = firestore.getDocument("WorkShop/" + String(key));

  return doc;
}

// ドキュメントを全件取得
function getDocs() {
  // CloudFirestoreからデータを読み込む
  const docs = firestore.getDocuments('WorkShop');

  return docs;
}

// function requestProject(){
function requestProject(projectId, mailAddress){
     
  var today = new Date();
  projectId = projectId.slice(7,13)

  const data = {
    "プロジェクトID": projectId,
    // "プロジェクトID": "000010",
    "登録日": today,
    // "メールアドレス": "naoki@ikeden.com",
    "メールアドレス": mailAddress,
  }

  firestore.createDocument("WorkshopRequest", data,);
  let doc = getDoc(projectId)
  let count = Number(doc.fields['参加数']['integerValue']) + 1;
  setDoc(projectId, count)
};

function dispIndex(){

  const page = "index";

  let template = HtmlService.createTemplateFromFile(page);
  return template
    .evaluate()
    .setTitle("ワークショップ")
    .addMetaTag('viewport', 'width=device-width,initial-scale=1').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);;
}

// 初期表示で呼び出される
function doGet(e) {
  const page = (e.parameter.p || "index");

  let li = [];
  if (e.parameter.p == "works.html" || e.parameter.p == "join.html") {

    var docs = getDocs()

    docs.forEach(function (doc) {
      var projectId = ('000000' + doc.fields['プロジェクトID']['integerValue']).slice(-6);
      var regist = doc.fields['登録日']['stringValue'];
      var tanto = doc.fields['開催者名']['stringValue'];
      var mailAddress = doc.fields['メールアドレス']['stringValue'];
      var nWork = doc.fields['ワークショップ名']['stringValue'];
      var contents = doc.fields['講義内容']['stringValue'];
      var ddd = doc.fields['開催日']['stringValue'];
      var sTime = doc.fields['開始時刻']['stringValue'];
      var fTime = doc.fields['終了時刻']['stringValue'];
      var conut = String(doc.fields['最少人数']['integerValue']);
      var cJoin = String(doc.fields['参加数']['integerValue']);
      var status = doc.fields['ステータス']['stringValue'];
      var array = [projectId, regist, tanto, mailAddress, nWork, contents, ddd, sTime, fTime, conut, cJoin, status]
      li.push(array);
    });
  };

  let template = HtmlService.createTemplateFromFile(page);
  template.links = li; // こうしておくとテンプレートの方で links という変数に値が入った状態で使える
  return template
    .evaluate()
    .setTitle("ワークショップ")
    .addMetaTag('viewport', 'width=device-width,initial-scale=1');
}
