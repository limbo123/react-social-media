export const changeNickname = (firestore, username, newNickname, ) => {
    
return new Promise (async(resolve, reject) => {
    let isUserExists = false;
    await firestore
      .collection("users")
      .where("nickname", "==", newNickname)
      .get()
      .then((res) => {
        if (res.docs.length > 0) {
          isUserExists = true;
        }
      });
    if (!isUserExists) {
      firestore
        .collection("users")
        .where("nickname", "==", username)
        .get()
        .then((res) => {
          res.docs[0].ref
            .update({
              nickname: newNickname,
            })
            .then(() => {
                resolve();
            });
        });
    } else {
      reject("username is already exists. Try another");
    }
})
  
}