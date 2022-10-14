
// CloudFirestoreの認証
var dateArray = firestoreIni();
var firestore = FirestoreApp.getFirestore(dateArray.email, dateArray.key, dateArray.projectId);

function firestoreIni() {
  var dateArray = {
    'email': "firebase-adminsdk-9epof@workshop-23257.iam.gserviceaccount.com",
    'key': "-----BEGIN PRIVATE KEY-----\AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==\n-----END PRIVATE KEY-----\n",
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
    "登録日": today,
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
