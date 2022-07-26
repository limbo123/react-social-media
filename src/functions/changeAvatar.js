import shortid from "shortid";

export const changeAvatar = (storage, file, firestore, currentUser) => {
  return new Promise((resolve) => {
    const imageName = shortid.generate();
    const uploadTask = storage
      .ref(`images/${imageName}.jpg`)
      .put(file);
    uploadTask.on(
      "state_changed",
      () => {},
      () => {},
      () => {
        storage
          .ref("images")
          .child(`${imageName}.jpg`)
          .getDownloadURL()
          .then((imageUrl) => {
            firestore.collection("users").doc(currentUser.id).update({
              profilePhoto: imageUrl,
            });
            currentUser.user.profilePhoto = imageUrl;
            resolve();
          });
      }
    );
  });
};
