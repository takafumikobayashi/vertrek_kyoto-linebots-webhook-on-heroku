import { Injectable } from '@nestjs/common';
import { Webhook } from '../interface/webhook.interface';

@Injectable()
export class FirebaseService {
    private readonly webhooks: Webhook[] = [];

    userActiveCheck(webhook: Webhook) {
        var admin = require('firebase-admin');
        let db = admin.firestore();
        let linebotsRef = db.collection('linebots');
        var d = new Date();
        webhook.events.forEach(function( value ){
            let query = linebotsRef.where('type', '==', value.source.type).where('userId', '==', value.source.userId);
            query.get().then(snapshot => {
                if (snapshot.empty) {
                    console.log('### Add User documents. =>', value.source.userId);
                    //ユーザー情報を登録
                    linebotsRef.doc().set({
                        enableFlg: true,
                        type: value.source.type,
                        userId: value.source.userId,
                        updDate: d
                    });
                    return;
                }
                snapshot.forEach(doc => {
                    if (value.type == 'unfollow'){
                        //enableFlgをFalseに更新
                        linebotsRef.doc(doc.id).update({
                            enableFlg: false,
                            updDate: d
                        });
                        console.log('### Disable User documents. =>', doc.id, ':', value.source.userId);
                    } else {
                        //enableFlgをTrueに更新
                        if (doc.data().enableFlg == false) {
                            linebotsRef.doc(doc.id).update({
                                enableFlg: true,
                                updDate: d
                            });
                            console.log('### Enable User documents. =>', doc.id, ':', value.source.userId);
                        }
                    }
                });
            })
            .catch(err => {
                console.log('### Error getting documents', err);
            });
        });
    }

    getEnableUser() {
        var admin = require('firebase-admin');
        let db = admin.firestore();
        let linebotsRef = db.collection('linebots');
        let query = linebotsRef.where('enableFlg', '==', true);
        query.get().then(snapshot => {
            return snapshot
        })
        .catch(err => {
            console.log('### Error getting documents', err);
        });
    }
}
