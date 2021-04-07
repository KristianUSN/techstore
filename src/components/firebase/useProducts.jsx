import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore();

const useProducts = (productID) => {
  const [produkter, setProdukter] = useState([]);

  useEffect(() => {
    let unsubscribeSnapshot;
    const unsubscribeAuth = firebase.auth().onAuthStateChanged(() => {
      switch (productID) {
        case "all":
          unsubscribeSnapshot = db
            .collection("Produkter")
            .onSnapshot((snapshot) => {
              setProdukter(snapshot.docs.map((doc) => doc.data()));
            });
          break;
          case productID:
            unsubscribeSnapshot = db
            .collection("Produkter")
            .where("Kategori", "==", productID)
            .onSnapshot((snapshot) => {
              setProdukter(snapshot.docs.map((doc) => doc.data()));
            });
          break;
          case "tilbud":
            unsubscribeSnapshot = db
            .collection("Produkter")
            .where("Tilbud", "!=", 0)
            .onSnapshot((snapshot) => {
              setProdukter(snapshot.docs.map((doc) => doc.data()));
            });
          break;
        default:
          db.collection("Produkter")
            .doc(productID)
            .get()
            .then((doc) => {
              if (doc.exists) {
                //console.log("Document data:", doc.data());
                setProdukter(doc.data());
              } else {
                console.log("No such document!");
              }
            });
      }

    });
    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot && unsubscribeSnapshot();
    };
  }, []);

  return [produkter];
};

export default useProducts;
