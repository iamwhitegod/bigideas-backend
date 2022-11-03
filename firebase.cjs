const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} = require("firebase/firestore");
const Email = require("./email.cjs");

const firebaseConfig = {
  apiKey: "AIzaSyC4_i8lCvMv3laOKAiomSfOw2elefQHiiQ",
  authDomain: "big-ideas-efde6.firebaseapp.com",
  projectId: "big-ideas-efde6",
  storageBucket: "big-ideas-efde6.appspot.com",
  messagingSenderId: "94653657224",
  appId: "1:94653657224:web:d1f47266af00478f352f3d",
  measurementId: "G-49GJ19FFJR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

exports.getAllSignups = async function () {
  const querySnapshot = await getDocs(collection(db, "signups2022"));
  const data = querySnapshot.docs.map((doc) => doc.data());
  console.log([...new Set(data.map((reg) => reg.email))].length);

  const emails = data.map((reg) => reg.email);
  const filtered = data.filter(
    ({ email }, index) => !emails.includes(email, index + 1)
  );

  return filtered;
};

exports.getSignup = async function (accessID) {
  const querySnapshot = await getDocs(collection(db, "signups2022"));
  let data = querySnapshot.docs.find((doc) => doc.data().accessID === accessID);
  data = data.data();

  return data;
};

exports.sendInvite = async function (signup) {
  new Email(signup).sendInvite();
};

exports.updateSignup = async function (accessID) {
  const querySnapshot = await getDocs(collection(db, "signups2022"));
  let data = querySnapshot.docs.find((doc) => doc.data().accessID === accessID);

  if (data.data().hasQRCode) return;

  const docRef = doc(db, "signups2022", data.id);
  await updateDoc(docRef, { hasQRCode: true });
};
