import firebase from 'firebase';

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

class Firebase {
    constructor() {
        firebase.initializeApp(config);
        this.firestore = firebase.firestore();
    }

    addLog = (log, userId) => {
        return new Promise((res,rej) => 
            this.firestore.collection('logs').add({
                    userId: userId,
                    date: log.date,
                    bodyFat: log.bodyFat,
                    bodyWeight: log.bodyWeight
                })
                .then(docRef => res(docRef.id))
                .catch(error => {
                    console.log(`Document failed with error: ${error}`);
                    rej(error);
                })
        );
    }

    getLogs = userId => {
        return new Promise((res,rej) => {
            this.firestore.collection('logs').where('userId','==',userId)
                .get()
                .then(querySnapshot => {
                    const logs = [];
                    querySnapshot.forEach(doc => {
                        const data = doc.data();
                        logs.push({
                            id: doc.id,
                            date: data.date,
                            bodyFat: data.bodyFat,
                            bodyWeight: data.bodyWeight
                        });
                    })
                    res(logs);
                })
                .catch(error => {
                    console.log(`Get failed with error: ${error}`);
                    rej(error);
                });
        });
    }

    removeLog = id => {
        return new Promise((res,rej) => {
            this.firestore.collection('logs').doc(id)
                .delete()
                .then(() => res())
                .catch(error => {
                    console.log(`Delete failed with error: ${error}`);
                    rej(error);
                });
        });
    }

    updateLog = (log, id) => {
        return new Promise((res,rej) => {
            this.firestore.collection('logs').doc(id)
                .update({
                    date: log.date,
                    bodyFat: log.bodyFat,
                    bodyWeight: log.bodyWeight
                })
                .then(() => res())
                .catch(error => {
                    console.log(`Updated failed with error: ${error}`);
                    rej(error);
                })
        });
    }
}

export default Firebase;
